import * as pg from "pg";
import dotenv from "dotenv";
const { Pool } = pg.default;
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_STRING,
});
