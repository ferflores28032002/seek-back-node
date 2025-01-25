"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = exports.taskStatusRouter = exports.taskRouter = void 0;
var taskRouter_1 = require("./taskRouter");
Object.defineProperty(exports, "taskRouter", { enumerable: true, get: function () { return __importDefault(taskRouter_1).default; } });
var taskStatusRouter_1 = require("./taskStatusRouter");
Object.defineProperty(exports, "taskStatusRouter", { enumerable: true, get: function () { return __importDefault(taskStatusRouter_1).default; } });
var userRoutes_1 = require("./userRoutes");
Object.defineProperty(exports, "userRouter", { enumerable: true, get: function () { return __importDefault(userRoutes_1).default; } });
