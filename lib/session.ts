'use server';

// lib/session.ts
import { cookies } from 'next/headers';
import { db } from '@/db';
import { sessions, usersTable, instructors } from '@/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

type SessionAccount =
  | { role: 'user'; id: number }
  | { role: 'instructor'; id: number };

export async function createSession(account: SessionAccount) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  
  // Absolute max backup lifetime in DB (e.g., 12 hours)
  const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);

  // 1. Store in database
  const sessionValues: typeof sessions.$inferInsert = {
    id: sessionId,
    userId: account.role === 'user' ? account.id : null,
    instructorId: account.role === 'instructor' ? account.id : null,
    expiresAt,
  };

  await db.insert(sessions).values(sessionValues);

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

  // Left join both tables to query either account type in 1 DB request
  const result = await db
    .select({
      session: sessions,
      user: usersTable,
      instructor: instructors,
    })
    .from(sessions)
    .leftJoin(usersTable, eq(sessions.userId, usersTable.id))
    .leftJoin(instructors, eq(sessions.instructorId, instructors.id))
    .where(eq(sessions.id, sessionId))
    .limit(1);

  if (result.length === 0) return null;

  const { session, user, instructor } = result[0];

  // Expiration check
  if (Date.now() > new Date(session.expiresAt).getTime()) {
    await deleteSession();
    return null;
  }

  // Return formatted payload with resolved account and explicit role
  if (instructor) {
    return {
      session,
      account: instructor,
      role: 'instructor' as const,
    };
  }

  if (user) {
    return {
      session,
      account: user,
      role: 'user' as const,
    };
  }

  return null;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (sessionId) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
  }

  cookieStore.delete('session_id');
}