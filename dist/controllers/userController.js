"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.forgotPassword = exports.verifyUser = exports.login = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const class_validator_1 = require("class-validator");
const BrevoService_1 = __importDefault(require("../services/BrevoService"));
const config_1 = require("../config");
const jwt_1 = require("../config/jwt");
const user_1 = require("../dto/user/");
const user_2 = __importDefault(require("../models/user"));
const paginationHelper_1 = require("../helpers/paginationHelper");
const templates_1 = require("../templates/");
const createUser = async (req, res) => {
    try {
        const dto = new user_1.CreateUserDTO();
        const emailService = new BrevoService_1.default();
        Object.assign(dto, req.body);
        await (0, class_validator_1.validateOrReject)(dto);
        const { email, password, name, status, isVerified } = dto;
        const hashedPassword = config_1.BcryptAdapter.hash(password);
        const user = await user_2.default.create({
            email,
            password: hashedPassword,
            name,
            status,
            isVerified,
        });
        const token = await jwt_1.JwtAdapter.generateToken({ id: user.id, email: user.email }, "5h");
        await emailService.sendEmail({
            recipient: { name, email },
            subject: "Bienvenido a la plataforma",
            template: (0, templates_1.verificationTemplate)({
                name,
                verifyLink: `${config_1.envs.VERIFY_ACCOUNT_URL}?token=${token}`,
            }),
        });
        res.status(201).json({ message: "User created successfully", user });
    }
    catch (error) {
        res.status(400).json({ errors: error });
    }
};
exports.createUser = createUser;
const getUsers = async (_req, res) => {
    try {
        const { page, limit } = (0, paginationHelper_1.getPaginationOptions)(_req);
        const users = await user_2.default.findAll();
        const paginatedUsers = (0, paginationHelper_1.paginate)(users, {
            page,
            limit,
        });
        res.status(200).json(paginatedUsers);
    }
    catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching users",
        });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await user_2.default.findByPk(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({
            message: "An error occurred while fetching the user",
        });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await user_2.default.findByPk(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const dto = new user_1.CreateUserDTO();
        Object.assign(dto, req.body);
        await (0, class_validator_1.validateOrReject)(dto);
        const { email, password, name, status, isVerified } = dto;
        await user.update({ email, password, name, status, isVerified });
        res.status(200).json({ message: "User updated successfully", user });
    }
    catch (error) {
        res.status(400).json({ errors: error });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await user_2.default.findByPk(id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        await user.destroy();
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({
            message: "An error occurred while deleting the user",
        });
    }
};
exports.deleteUser = deleteUser;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_2.default.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (!user.isVerified) {
            res.status(401).json({ message: "User is not verified" });
            return;
        }
        const isValidPassword = config_1.BcryptAdapter.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = await jwt_1.JwtAdapter.generateToken({ id: user.id, email: user.email }, "5h");
        if (!token) {
            res
                .status(500)
                .json({ message: "An error occurred while generating token" });
            return;
        }
        res.status(200).json({ token, user });
    }
    catch (error) {
        res.status(500).json({
            message: "An error occurred while logging in",
        });
    }
};
exports.login = login;
const verifyUser = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = await jwt_1.JwtAdapter.validateToken(token);
        if (!decoded) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        const user = await user_2.default.findByPk(decoded.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        await user.update({ isVerified: true });
        res.status(200).json({ message: "User verified successfully" });
    }
    catch (error) {
        res.status(500).json({
            message: "An error occurred while verifying the user",
        });
    }
};
exports.verifyUser = verifyUser;
const forgotPassword = async (req, res) => {
    try {
        const dto = new user_1.ForgotPasswordDto();
        const emailService = new BrevoService_1.default();
        Object.assign(dto, req.body);
        await (0, class_validator_1.validateOrReject)(dto);
        const { email } = dto;
        const user = await user_2.default.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const token = await jwt_1.JwtAdapter.generateToken({ id: user.id, email: user.email }, "1h");
        await emailService.sendEmail({
            recipient: { name: user.name, email: user.email },
            subject: "Restablece tu contraseña",
            template: (0, templates_1.resetPasswordTemplate)({
                name: user.name,
                resetLink: `${config_1.envs.FORGOT_PASSWORD_URL}?token=${token}`,
            }),
        });
        res.status(200).json({ message: "Password reset email sent successfully" });
    }
    catch (error) {
        res.status(400).json({ errors: error });
    }
};
exports.forgotPassword = forgotPassword;
const updatePassword = async (req, res) => {
    try {
        const dto = new user_1.UpdatePasswordDto();
        Object.assign(dto, req.body);
        await (0, class_validator_1.validateOrReject)(dto);
        const { token, newPassword } = dto;
        const decoded = await jwt_1.JwtAdapter.validateToken(token);
        if (!decoded || !decoded.id) {
            res.status(400).json({ message: "Invalid or expired token" });
            return;
        }
        const user = await user_2.default.findByPk(decoded.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const hashedPassword = config_1.BcryptAdapter.hash(newPassword);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    }
    catch (error) {
        res.status(400).json({ errors: error });
    }
};
exports.updatePassword = updatePassword;
