"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBPASSWORD = exports.DBUSERNAME = exports.DBNAME = exports.FORGET_PASSWORD_PREFIX = exports.SECRET = exports.COOKIE_NAME = exports.__prod__ = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.__prod__ = process.env.NODE_ENV === "production";
exports.COOKIE_NAME = "qid";
exports.SECRET = process.env.SECRET;
exports.FORGET_PASSWORD_PREFIX = "forget-password:";
exports.DBNAME = process.env.DB_NAME;
exports.DBUSERNAME = process.env.DB_USER;
exports.DBPASSWORD = process.env.DB_PASS;
//# sourceMappingURL=constants.js.map