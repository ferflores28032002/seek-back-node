import cors from "cors";

import express, { Application, Request, Response } from "express";

import { taskRouter, taskStatusRouter, userRouter } from "./routes";

class Server {
  private app: Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private routes() {
    this.app.get("/", (req: Request, res: Response) => {
      res.send("¡Hello world!");
    });

    this.app.use("/api/v1/users", userRouter);
    this.app.use("/api/v1/task", taskRouter);
    this.app.use("/api/v1/status", taskStatusRouter);
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

export default Server;
