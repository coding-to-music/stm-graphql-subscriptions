import dotenv from "dotenv";
dotenv.config();

export const __prod__ = process.env.NODE_ENV === "production";
export const COOKIE_NAME = "qid";
export const SECRET = process.env.SECRET as string;
export const FORGET_PASSWORD_PREFIX = "forget-password:";
export const DBNAME = process.env.DB_NAME;
export const DBUSERNAME = process.env.DB_USER;
export const DBPASSWORD = process.env.DB_PASS;
