const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const sqlPath = path.join(__dirname, "../supabase/schema.sql");
const sql = fs.readFileSync(sqlPath, "utf8");

const client = new Client({
  user: "postgres",
  host: "db.ehlqrvjorayhofbttnfw.supabase.co",
  database: "postgres",
  password: "?V*hKjDg6tUuge!",
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  try {
    console.log("Connecting to Supabase Postgres (ehlqrvjorayhofbttnfw.supabase.co)...");
    await client.connect();
    console.log("Connected. Running schema.sql database migrations...");
    await client.query(sql);
    console.log("Database schema applied successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
