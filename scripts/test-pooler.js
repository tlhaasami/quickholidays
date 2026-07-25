const { Client } = require("pg");

const regions = [
  "eu-west-2",     // London (most likely for UK users)
  "eu-west-1",     // Ireland
  "eu-central-1",  // Frankfurt
  "us-east-1",     // N. Virginia
  "us-west-2",     // Oregon
  "us-west-1",     // N. California
  "ap-southeast-1" // Singapore
];

const projectRef = "ehlqrvjorayhofbttnfw";
const password = "?V*hKjDg6tUuge!";

async function testRegion(region) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  const username = `postgres.${projectRef}`;
  
  console.log(`Testing region: ${region} (${host})...`);
  
  const client = new Client({
    user: username,
    host: host,
    database: "postgres",
    password: password,
    port: 6543, // Transaction pooler port
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000 // Timeout fast
  });

  try {
    await client.connect();
    console.log(`\n🎉 SUCCESS! Connected successfully to ${region} pooler!`);
    await client.end();
    return true;
  } catch (err) {
    console.log(`❌ Failed for ${region}: ${err.message}`);
    return false;
  }
}

async function run() {
  for (const region of regions) {
    const success = await testRegion(region);
    if (success) {
      console.log(`\nUse this host: aws-0-${region}.pooler.supabase.com`);
      console.log(`Use this user: postgres.${projectRef}`);
      console.log(`Use this port: 6543`);
      process.exit(0);
    }
  }
  console.log("\nCould not find a successful connection region. Please check database password or project reference.");
  process.exit(1);
}

run();
