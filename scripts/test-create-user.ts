import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

console.log(
  "DATABASE_URL loaded:",
  Boolean(process.env.DATABASE_URL)
);

async function main() {
  // Import only AFTER environment variables have loaded
  const { createUser } = await import("../app/actions");

  const result = await createUser({
    name: "Test User",
    age: 20,
    email: `test-${Date.now()}@example.com`,
    phone: "+251900000000",
    image: "s;kfjgsdfgjoifgjodkfgdk",
    year: 2,
    password: "TestPassword123!",
  });

  console.dir(result, { depth: null });
}

main().catch(console.error);