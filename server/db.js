import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

//RIS DATABASE
export const risPool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,

  max: 20,
  idleTimeoutMillis: 30000, //close unused database after 30seconds
  connectionTimeoutMillis: 5000, // wait 5 seconds when trying to get a db connection, if failes, error is thrown / request fails
});

risPool.on("error", (err) => {
  console.error("Unexpected PostgreSQL Pool Error", err);
});

//CONSUMABLE ISSUANCE
export const conPool = new Pool({
  host: process.env.DB2_HOST,
  port: Number(process.env.DB2_PORT),
  user: process.env.DB2_USER,
  password: process.env.DB2_PASSWORD,
  database: process.env.DB2_NAME,

  max: 20,
  idleTimeoutMillis: 30000, //close unused database after 30seconds
  connectionTimeoutMillis: 5000, // wait 5 seconds when trying to get a db connection, if failes, error is thrown / request fails
});

conPool.on("error", (err) => {
  console.error("Unexpected PostgreSQL Pool Error", err);
});
