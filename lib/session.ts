// lib/session.ts
import { cookies } from 'next/headers';
import { db } from '@/db';
import { sessions, usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function createSession(userId: string) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  
  // Absolute max backup lifetime in DB (e.g., 12 hours)
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);

  // 1. Store in database
  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt,
  });

  // 2. Set Session Cookie (Omitting 'expires' and 'maxAge' makes it in-memory)
  const cookieStore = await cookies();
  cookieStore.set('session_id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // NO 'expires' OR 'maxAge' HERE -> Cookie deleted when browser closes
  });
}

export async function verifySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) return null;

  const result = await db
    .select({ user: usersTable, session: sessions })
    .from(sessions)
    .innerJoin(usersTable, eq(sessions.userId, usersTable.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (result.length === 0) return null;

  const { user, session } = result[0];

  if (Date.now() > new Date(session.expiresAt).getTime()) {
    await deleteSession();
    return null;
  }

  return { user, session };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (sessionId) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  cookieStore.delete('session_id');
}