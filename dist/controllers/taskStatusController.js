"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskStatus = exports.updateTaskStatus = exports.getTaskStatuses = exports.createTaskStatus = void 0;
const class_validator_1 = require("class-validator");
const CreateTaskStatusDto_1 = require("../dto/TaskStatus/CreateTaskStatusDto");
const customError_1 = __importDefault(require("../error/customError"));
const TaskStatus_1 = __importDefault(require("../models/TaskStatus"));
const createTaskStatus = async (req, res) => {
    try {
        const dto = new CreateTaskStatusDto_1.CreateTaskStatusDto();
        Object.assign(dto, req.body);
        await (0, class_validator_1.validateOrReject)(dto);
        const { name, description, color } = dto;
        const duplicateTaskStatus = await TaskStatus_1.default.findOne({ where: { name } });
        if (duplicateTaskStatus) {
            res.status(400).json({ message: "El estatus de la tarea ya existe" });
            return;
        }
        const taskStatus = await TaskStatus_1.default.create({ name, description, color });
        res
            .status(201)
            .json({ message: "El estatus de la tarea creado con exito", taskStatus });
    }
    catch (error) {
        throw customError_1.default.InternalServerError();
    }
};
exports.createTaskStatus = createTaskStatus;
const getTaskStatuses = async (_req, res) => {
    try {
        const taskStatuses = await TaskStatus_1.default.findAll();
        res.status(200).json(taskStatuses);
    }
    catch (error) {
        throw customError_1.default.InternalServerError();
    }
};
exports.getTaskStatuses = getTaskStatuses;
const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const taskStatus = await TaskStatus_1.default.findByPk(id);
        if (!taskStatus) {
            res.status(404).json({ message: "Tarea no encontrada" });
            return;
        }
        Object.assign(taskStatus, req.body);
        await taskStatus.save();
        res
            .status(200)
            .json({ message: "Tarea actualizada con exito", taskStatus });
    }
    catch (error) {
        throw customError_1.default.InternalServerError();
    }
};
exports.updateTaskStatus = updateTaskStatus;
const deleteTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const taskStatus = await TaskStatus_1.default.findByPk(id);
        if (!taskStatus) {
            res.status(404).json({ message: "Tarea no encontrada" });
            return;
        }
        await taskStatus.destroy();
        res.status(200).json({ message: "Tarea eliminada con exito" });
    }
    catch (error) {
        throw customError_1.default.InternalServerError();
    }
};
exports.deleteTaskStatus = deleteTaskStatus;
