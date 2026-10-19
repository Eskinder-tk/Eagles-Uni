
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Pool } from "pg";

type JournalEntry = {
  idx: number;
  when: number;
  tag: string;
};

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is missing from .env.local");
  }

  const journal = JSON.parse(
    readFileSync("drizzle/meta/_journal.json", "utf8")
  ) as { entries: JournalEntry[] };

  const migrations = journal.entries.map((entry) => {
    const content = readFileSync(
      resolve("drizzle", `${entry.tag}.sql`),
      "utf8"
    );

    return {
      entry,
      hash: createHash("sha256")
        .update(content, "utf8")
        .digest("hex"),
    };
  });

  const pool = new Pool({
    connectionString,
    connectionTimeoutMillis: 10000,
  });

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Prevent another migration process from changing the history
    // while this baseline check is running.
    await client.query(`
      LOCK TABLE drizzle.__drizzle_migrations
      IN EXCLUSIVE MODE
    `);

    const history = await client.query<{
      hash: string;
      created_at: string;
    }>(`
      SELECT hash, created_at
      FROM drizzle.__drizzle_migrations
      ORDER BY created_at
    `);

    if (history.rows.length !== 5) {
      throw new Error(
        `Expected 5 existing migration records; found ${history.rows.length}.`
      );
    }

    // Confirm that the existing records match local migrations 0000–0004.
    for (const migration of migrations.slice(0, 5)) {
      const recorded = history.rows.find(
        (row) => Number(row.created_at) === migration.entry.when
      );

      if (!recorded || recorded.hash !== migration.hash) {
        throw new Error(
          `Existing history does not match ${migration.entry.tag}. ` +
          "Aborting without inserting anything."
        );
      }
    }

    // Check the known final-schema invariants.
    const sequence = await client.query(`
      SELECT to_regclass('public.instructor_id_sequence') IS NOT NULL AS ok
    `);

    if (!sequence.rows[0].ok) {
      throw new Error("The instructor sequence is missing.");
    }

    const instructorDefault = await client.query(`
      SELECT pg_get_expr(d.adbin, d.adrelid) AS expression
      FROM pg_attribute a
      JOIN pg_class c ON c.oid = a.attrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_attrdef d
        ON d.adrelid = c.oid AND d.adnum = a.attnum
      WHERE n.nspname = 'public'
        AND c.relname = 'instructors'
        AND a.attname = 'instructor_code'
        AND NOT a.attisdropped
    `);

    if (
      !instructorDefault.rows[0]?.expression?.includes(
        "instructor_id_sequence"
      )
    ) {
      throw new Error(
        "The instructor_code default does not reference the expected sequence."
      );
    }

    const sessionColumns = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'sessions'
        AND column_name IN ('user_id', 'instructor_id')
    `);

    for (const column of ["user_id", "instructor_id"]) {
      const found = sessionColumns.rows.find(
        (row) => row.column_name === column
      );

      if (found?.data_type !== "integer") {
        throw new Error(
          `sessions.${column} is not an integer column.`
        );
      }
    }

    const primaryKey = await client.query(`
      SELECT array_agg(a.attname ORDER BY k.ordinality) AS columns
      FROM pg_constraint c
      JOIN pg_class t ON t.oid = c.conrelid
      JOIN pg_namespace n ON n.oid = t.relnamespace
      CROSS JOIN LATERAL
        unnest(c.conkey) WITH ORDINALITY AS k(attnum, ordinality)
      JOIN pg_attribute a
        ON a.attrelid = t.oid AND a.attnum = k.attnum
      WHERE n.nspname = 'public'
        AND t.relname = 'user_courses'
        AND c.contype = 'p'
      GROUP BY c.oid
    `);

    
const expectedPrimaryKey = [
  "user_id",
  "course_id",
  "semester",
  "academic_year",
];

const rawPrimaryKey = primaryKey.rows[0]?.columns;

const actualPrimaryKey: string[] | undefined =
  Array.isArray(rawPrimaryKey)
    ? rawPrimaryKey
    : typeof rawPrimaryKey === "string" &&
        rawPrimaryKey.startsWith("{") &&
        rawPrimaryKey.endsWith("}")
      ? rawPrimaryKey.slice(1, -1).split(",")
      : undefined;

if (
  JSON.stringify(actualPrimaryKey) !==
  JSON.stringify(expectedPrimaryKey)
) {
  throw new Error(
    `Unexpected user_courses primary key: ${
      JSON.stringify(rawPrimaryKey)
    }`
  );
}


    const missing = migrations.slice(5);

    console.log("Existing history verified: migrations 0000–0004.");
    console.log("Key schema checks passed.");
    console.log("Pending baseline records:");

    for (const migration of missing) {
      console.log(
        `${migration.entry.tag} | ${migration.entry.when} | ${migration.hash}`
      );
    }

    if (!process.argv.includes("--apply")) {
      console.log(
        "\nDRY RUN: no migration-history records were inserted."
      );
      console.log(
        "Review the schema and backup before running with --apply."
      );

      await client.query("ROLLBACK");
      return;
    }

    for (const migration of missing) {
      await client.query(
        `INSERT INTO drizzle.__drizzle_migrations
          (hash, created_at)
         VALUES ($1, $2)`,
        [migration.hash, migration.entry.when]
      );
    }

    await client.query("COMMIT");

    console.log(
      "Baseline recorded successfully. No application tables or data were modified."
    );
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Baseline failed:", error);
  process.exitCode = 1;
});
