"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const class_validator_1 = require("class-validator");
const CreateTaskDto_1 = require("../dto/Task/CreateTaskDto");
const UpdateTaskDto_1 = require("../dto/Task/UpdateTaskDto");
const customError_1 = __importDefault(require("../error/customError"));
const task_1 = __importDefault(require("../models/task"));
const TaskStatus_1 = __importDefault(require("../models/TaskStatus"));
const user_1 = __importDefault(require("../models/user"));
const createTask = async (req, res) => {
    try {
        const dto = new CreateTaskDto_1.CreateTaskDto();
        Object.assign(dto, req.body);
        await (0, class_validator_1.validateOrReject)(dto);
        const { title, description, statusId } = dto;
        const duplicateTask = await task_1.default.findOne({ where: { title } });
        if (duplicateTask) {
            res.status(404).json({ message: "La tarea ya existe!" });
            return;
        }
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const status = await TaskStatus_1.default.findByPk(statusId);
        if (!status) {
            res.status(404).json({ message: "El estado de la tarea no existe!" });
            return;
        }
        const task = await task_1.default.create({
            title,
            description,
            statusId,
            createdBy: userId,
        });
        res.status(201).json({ message: "Task created successfully", task });
    }
    catch (error) {
        throw customError_1.default.InternalServerError();
    }
};
exports.createTask = createTask;
const getTasks = async (_req, res) => {
    try {
        const userId = _req.userId;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const tasks = await task_1.default.findAll({
            where: { createdBy: userId },
            include: [TaskStatus_1.default, user_1.default],
        });
        res.status(200).json(tasks);
    }
    catch (error) {
        throw customError_1.default.InternalServerError();
    }
};
exports.getTasks = getTasks;
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await task_1.default.findByPk(id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        const dto = new UpdateTaskDto_1.UpdateTaskDto();
        Object.assign(dto, req.body);
        await (0, class_validator_1.validateOrReject)(dto);
        const duplicateTask = await task_1.default.findOne({ where: { title: dto.title } });
        if (duplicateTask) {
            res.status(404).json({ message: "La tarea ya existe!" });
            return;
        }
        Object.assign(task, req.body);
        await task.save();
        res.status(200).json({ message: "Task updated successfully", task });
    }
    catch (error) {
        throw customError_1.default.InternalServerError();
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await task_1.default.findByPk(id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        await task.destroy();
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (error) {
        throw customError_1.default.InternalServerError();
    }
};
exports.deleteTask = deleteTask;
