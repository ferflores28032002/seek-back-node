import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/taskController";
import { authenticateToken } from "../middleware/auth.middleware";

const taskRouter = Router();

taskRouter.post("/", authenticateToken, createTask);
taskRouter.get("/", authenticateToken, getTasks);
taskRouter.put("/:id", authenticateToken, updateTask);
taskRouter.delete("/:id", authenticateToken, deleteTask);

export default taskRouter;
