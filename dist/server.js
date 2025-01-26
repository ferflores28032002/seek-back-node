"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
const swaggerDocument_json_1 = __importDefault(require("../swaggerDocument.json"));
class Server {
    constructor(port) {
        this.app = (0, express_1.default)();
        this.port = port;
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use(express_1.default.json());
        this.app.use((0, cors_1.default)());
    }
    routes() {
        this.app.get("/", (req, res) => {
            res.send("Welcome to the API! Visit /api-docs for Swagger documentation.");
        });
        this.app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument_json_1.default));
        this.app.use("/api/v1/users", routes_1.userRouter);
        this.app.use("/api/v1/task", routes_1.taskRouter);
        this.app.use("/api/v1/status", routes_1.taskStatusRouter);
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}
exports.default = Server;
