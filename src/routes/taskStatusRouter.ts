import { Router } from "express";

import {
  createTaskStatus,
  deleteTaskStatus,
  getTaskStatuses,
  updateTaskStatus,
} from "../controllers/taskStatusController";
import { authenticateToken } from "../middleware/auth.middleware";

const taskStatusRouter = Router();

taskStatusRouter.post("/", authenticateToken, createTaskStatus);
taskStatusRouter.get("/", authenticateToken, getTaskStatuses);
taskStatusRouter.put("/:id", authenticateToken, updateTaskStatus);
taskStatusRouter.delete("/:id", authenticateToken, deleteTaskStatus);

export default taskStatusRouter;
