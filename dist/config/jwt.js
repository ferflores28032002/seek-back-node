"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAdapter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envs_1 = require("./envs");
const JWT_SECRET = envs_1.envs.JWT;
class JwtAdapter {
    static async generateToken(payload, duration = "2h") {
        return new Promise((resolve) => {
            jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: duration }, (err, token) => {
                if (err)
                    resolve(null);
                resolve(token);
            });
        });
    }
    static validateToken(token) {
        return new Promise((resolve) => {
            jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
                if (err)
                    return resolve(null);
                resolve(decoded);
            });
        });
    }
}
exports.JwtAdapter = JwtAdapter;
