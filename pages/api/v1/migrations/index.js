import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(request.method)) {
    return response.status(405).end();
  }

  const dbClient = await database.getNewClient();

  const defaultMigrationsOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  try {
    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationsOptions);

      await dbClient.end();

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsOptions,
        dryRun: false,
      });

      await dbClient.end();

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error("Error: ", error);
  } finally {
    await dbClient.end();
  }
}

export default migrations;
