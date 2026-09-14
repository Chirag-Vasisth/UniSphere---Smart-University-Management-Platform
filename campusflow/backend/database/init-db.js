/**
 * CampusFlow Database Initializer CLI Helper
 * Executes schema.sql and seed.sql using the pg pool connection.
 */

const fs = require('fs');
const path = require('path');
const { pool } = require('../src/config/database');

async function runScript() {
  const mode = process.argv[2] || 'schema';
  const fileName = mode === 'seed' ? 'seed.sql' : 'schema.sql';
  const filePath = path.join(__dirname, fileName);

  console.log(`=============================================`);
  console.log(`🗄️  CampusFlow Database Helper`);
  console.log(`📄 Executing: ${fileName}`);
  console.log(`=============================================`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(filePath, 'utf-8');

  try {
    const client = await pool.connect();
    console.log(`✅ Connected to PostgreSQL database successfully.`);
    console.log(`⏳ Executing SQL statements...`);

    await client.query(sql);

    console.log(`🎉 Success! ${fileName} executed without errors.`);
    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Database execution failed:`);
    console.error(error.message);
    console.error(`\nPlease ensure PostgreSQL is running and your .env credentials match:`);
    console.error(`DATABASE_HOST=${process.env.DATABASE_HOST || 'localhost'}`);
    console.error(`DATABASE_PORT=${process.env.DATABASE_PORT || 5432}`);
    console.error(`DATABASE_NAME=${process.env.DATABASE_NAME || 'campusflow'}`);
    console.error(`DATABASE_USER=${process.env.DATABASE_USER || 'postgres'}`);
    await pool.end();
    process.exit(1);
  }
}

runScript();
