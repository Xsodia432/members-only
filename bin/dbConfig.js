const { Client } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv/config");

const main = async () => {
  console.log("Creating tables...");
  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(
    "CREATE TABLE IF NOT EXISTS membership(id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,tier INTEGER)"
  );
  await client.query(
    "CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, first_name VARCHAR(255),last_name VARCHAR(255),password VARCHAR(255),membership_status INTEGER REFERENCES membership(id))"
  );

  await client.query(
    "CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,title VARCHAR(255),post TEXT,timestamp TIMESTAMP,user_id INTEGER REFERENCES users(id)) ON DELETE CASCADE"
  );
  await client.query(
    "INSERT INTO users(first_name,last_name,password,membership_status,username) VALUES($1,$2,$3,$4,$5)",
    ["Colag", "Macdish", hashedPassword, 1, xsodia4320]
  );
  await client.end();
  console.log("done");
};

main();
