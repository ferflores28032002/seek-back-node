import { Request, Response } from "express";
import { Op } from "sequelize";

import { validateOrReject } from "class-validator";

import { CreateTaskDto } from "../dto/Task/CreateTaskDto";
import { UpdateTaskDto } from "../dto/Task/UpdateTaskDto";

import CustomError from "../error/customError";
import Task from "../models/task";
import TaskStatus from "../models/TaskStatus";
import User from "../models/user";

export const createTask = async (req: Request, res: Response) => {
  try {
    const dto = new CreateTaskDto();
    Object.assign(dto, req.body);
    await validateOrReject(dto);

    const { title, description, statusId } = dto;

    const duplicateTask = await Task.findOne({ where: { title } });

    if (duplicateTask) {
      res.status(404).json({ message: "La tarea ya existe!" });
      return;
    }

    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const status = await TaskStatus.findByPk(statusId);
    if (!status) {
      res.status(404).json({ message: "El estado de la tarea no existe!" });
      return;
    }

    const task = await Task.create({
      title,
      description,
      statusId,
      createdBy: userId,
    });

    res.status(201).json({ message: "Tarea creada con exito", task });
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};

export const getTasks = async (_req: Request, res: Response) => {
  try {
    const userId = (_req as any).userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const tasks = await Task.findAll({
      where: { createdBy: userId },
      include: [TaskStatus, User],
      order: [
        ['updatedAt', 'DESC'], // Prioriza tareas actualizadas más recientemente
        ['createdAt', 'DESC'], // En caso de empate, prioriza las tareas más recientes
      ],
    });
    res.status(200).json(tasks);
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      res.status(404).json({ message: "Tarea no encontrada"});
      return;
    }

    const dto = new UpdateTaskDto();
    Object.assign(dto, req.body);
    await validateOrReject(dto);

    const duplicateTask = await Task.findOne({
      where: {
        title: dto.title,
        id: { [Op.ne]: id }, // Exclude the current task
      },
    });

    if (duplicateTask) {
      res.status(404).json({ message: "La tarea ya existe!" });
      return;
    }

    Object.assign(task, req.body);
    await task.save();

    res.status(200).json({ message: "Tarea actualizada con exito", task });
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      res.status(404).json({ message: "Tarea no encontrada" });
      return;
    }

    await task.destroy();
    res.status(200).json({  message: 'Tarea eliminada correctamente'});
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};
