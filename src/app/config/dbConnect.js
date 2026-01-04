import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const connectDB = async () => {
  try {
    const pool = new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 5432,
    });

    const client = await pool.connect();
    console.log("✅ PostgreSQL Connected Successfully!");
    client.release();

    return pool;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
