"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = __importDefault(require("./task"));
const TaskStatus_1 = __importDefault(require("./TaskStatus"));
const user_1 = __importDefault(require("./user"));
exports.default = [user_1.default, TaskStatus_1.default, task_1.default];
