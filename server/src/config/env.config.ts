import dotenv from "dotenv";

dotenv.config();

const environmentConfig = Object.freeze({
  env: process.env.NODE_ENV || "dev",
  name: process.env.APP_NAME,
  port: process.env.APP_PORT,
  db: {
    DB_URL: process.env.DB_URL,
    DB_NAME: process.env.DB_NAME,
  },
});

export default environmentConfig;
