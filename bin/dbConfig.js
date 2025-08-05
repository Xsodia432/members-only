const { Client } = require("pg");
require("dotenv/config");

const main = async () => {
  console.log("Creating tables...");
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
    "CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,title VARCHAR(255),post TEXT,timestamp TIMESTAMP,user_id INTEGER REFERENCES users(id))"
  );
  await client.end();
  console.log("done");
};

main();
