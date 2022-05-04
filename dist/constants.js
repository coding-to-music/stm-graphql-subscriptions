"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.__prod__ = process.env.NODE_ENV === "production";
exports.COOKIE_NAME = "qid";
exports.SECRET = process.env.SECRET;
exports.FORGET_PASSWORD_PREFIX = "forget-password:";
exports.DBNAME = process.env.DB_NAME;
exports.DBUSERNAME = process.env.DB_USER;
exports.DBPASSWORD = process.env.DB_PASS;
exports.STMKEY = process.env.STMKEY;
exports.REDIS_URL = process.env.REDIS_URL || `127.0.0.1:6379`;
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://mini.local:3000";
//# sourceMappingURL=constants.js.map