import database from "infra/database.js";

beforeAll(async () => {
  await cleanDatabase();
});

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function testMethod(method) {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: method,
  });

  return response.status;
}

test("other http methods to /api/v1/migrations should return 405", async () => {
  const notAllowedMethods = ["HEAD", "PUT", "DELETE", "OPTIONS", "PATCH"];
  for (const method of notAllowedMethods) {
    const status = await testMethod(method);

    expect(status).toBe(405);
  }
});

test("should must be only 1 connection open to the database", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();

  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
});
