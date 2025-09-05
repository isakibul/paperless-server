const { Client } = require("pg");

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

const connectDatabase = async () => {
  try {
    await client.connect();
    console.log(`${new Date().toISOString()} - Connected to PostgreSQL`);
  } catch (err) {
    console.error(
      `${new Date().toISOString()} - DB Connection Error:`,
      err.stack
    );
    process.exit(1);
  }
};

module.exports = connectDatabase;
