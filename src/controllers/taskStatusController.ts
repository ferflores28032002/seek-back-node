import { Request, Response } from "express";

import { validateOrReject } from "class-validator";

import { CreateTaskStatusDto } from "../dto/TaskStatus/CreateTaskStatusDto";
import CustomError from "../error/customError";

import TaskStatus from "../models/TaskStatus";

export const createTaskStatus = async (req: Request, res: Response) => {
  try {
    const dto = new CreateTaskStatusDto();
    Object.assign(dto, req.body);
    await validateOrReject(dto);

    const { name, description, color } = dto;

    const duplicateTaskStatus = await TaskStatus.findOne({ where: { name } });

    if (duplicateTaskStatus) {
      res.status(400).json({ message: "Task status already exists" });
      return;
    }

    const taskStatus = await TaskStatus.create({ name, description, color });
    res
      .status(201)
      .json({ message: "Task status created successfully", taskStatus });
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};

export const getTaskStatuses = async (_req: Request, res: Response) => {
  try {
    const taskStatuses = await TaskStatus.findAll();
    res.status(200).json(taskStatuses);
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};

export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const taskStatus = await TaskStatus.findByPk(id);

    if (!taskStatus) {
      res.status(404).json({ message: "Task status not found" });
      return;
    }

    Object.assign(taskStatus, req.body);
    await taskStatus.save();

    res
      .status(200)
      .json({ message: "Task status updated successfully", taskStatus });
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};

export const deleteTaskStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const taskStatus = await TaskStatus.findByPk(id);

    if (!taskStatus) {
      res.status(404).json({ message: "Task status not found" });
      return;
    }

    await taskStatus.destroy();
    res.status(200).json({ message: "Task status deleted successfully" });
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};
