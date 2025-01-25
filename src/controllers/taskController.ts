import { validateOrReject } from "class-validator";
import { Request, Response } from "express";

import { CreateTaskDto } from "../dto/Task/CreateTaskDto";
import { UpdateTaskDto } from "../dto/Task/UpdateTaskDto";

import Task from "../models/task";
import TaskStatus from "../models/TaskStatus";
import User from "../models/user";

export const createTask = async (req: Request, res: Response) => {
  try {
    const dto = new CreateTaskDto();
    Object.assign(dto, req.body);
    await validateOrReject(dto);

    const { title, description, statusId } = dto;

    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const status = await TaskStatus.findByPk(statusId);
    if (!status) {
      res.status(404).json({ message: "Task status not found" });
      return;
    }

    const task = await Task.create({
      title,
      description,
      statusId,
      createdBy: userId,
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(400).json({ errors: error });
  }
};

export const getTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.findAll({ include: [TaskStatus, User] });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching tasks" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    const dto = new UpdateTaskDto();
    Object.assign(dto, req.body);
    await validateOrReject(dto);

    Object.assign(task, req.body);
    await task.save();

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(400).json({ errors: error });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    await task.destroy();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while deleting the task" });
  }
};
