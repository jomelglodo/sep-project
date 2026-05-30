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
});

/* export const conIssuanceDB = new Pool({
  host: process.env.DB2_HOST,
  port: Number(process.env.DB2_PORT),
  user: process.env.DB2_USER,
  password: process.env.DB2_PASSWORD,
  database: process.env.DB2_NAME,
});
 */
