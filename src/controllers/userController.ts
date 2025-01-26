import { Request, Response } from "express";

import { validateOrReject } from "class-validator";

import EmailService from "../services/BrevoService";

import { BcryptAdapter, envs } from "../config";
import { JwtAdapter } from "../config/jwt";

import {
  CreateUserDto,
  ForgotPasswordDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from "../dto/user/";

import User from "../models/user";

import CustomError from "../error/customError";
import {
  getPaginationOptions,
  paginate,
  PaginatedResult,
} from "../helpers/paginationHelper";

import { resetPasswordTemplate, verificationTemplate } from "../templates/";

export const createUser = async (req: Request, res: Response) => {
  try {
    const dto = new CreateUserDto();
    const emailService = new EmailService();

    Object.assign(dto, req.body);
    await validateOrReject(dto);

    const { email, password, name, status, isVerified } = dto;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        message: `El correo electrónico '${email}' ya está registrado. Por favor, utiliza otro.`,
      });
      return;
    }

    const hashedPassword = BcryptAdapter.hash(password);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      status,
      isVerified,
    });

    const token = await JwtAdapter.generateToken(
      { id: user.id, email: user.email },
      "10h"
    );

    await emailService.sendEmail({
      recipient: { name, email },
      subject: "Bienvenido a la plataforma",
      template: verificationTemplate({
        name,
        verifyLink: `${envs.VERIFY_ACCOUNT_URL}?token=${token}`,
      }),
    });

    res
      .status(201)
      .json({
        message: "Se ha enviado un correo de verificación a tu cuenta.",
        user,
      });
  } catch (error) {
    res.status(400).json({ errors: error });
  }
};

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { page, limit } = getPaginationOptions(_req);

    const users = await User.findAll();

    const paginatedUsers: PaginatedResult<User> = paginate(users, {
      page,
      limit,
    });

    res.status(200).json(paginatedUsers);
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const dto = new UpdateUserDto();
    Object.assign(dto, req.body);
    await validateOrReject(dto);

    await user.update(dto);

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
      return;
    }

    if (!user.isVerified) {
      res.status(401).json({
        message:
          "El usuario no está verificado. Por favor, revise su correo electrónico para completar la verificación.",
      });
      return;
    }

    const isValidPassword = BcryptAdapter.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = await JwtAdapter.generateToken(
      { id: user.id, email: user.email },
      "10h"
    );

    if (!token) {
      res
        .status(500)
        .json({ message: "An error occurred while generating token" });
      return;
    }

    res.status(200).json({ token, user });
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const decoded = await JwtAdapter.validateToken<{
      id: number;
      email: string;
    }>(token);

    if (!decoded) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await user.update({ isVerified: true });

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const dto = new ForgotPasswordDto();
    const emailService = new EmailService();

    Object.assign(dto, req.body);
    await validateOrReject(dto);

    const { email } = dto;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const token = await JwtAdapter.generateToken(
      { id: user.id, email: user.email },
      "10h"
    );

    await emailService.sendEmail({
      recipient: { name: user.name, email: user.email },
      subject: "Restablece tu contraseña",
      template: resetPasswordTemplate({
        name: user.name,
        resetLink: `${envs.FORGOT_PASSWORD_URL}?token=${token}`,
      }),
    });

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const dto = new UpdatePasswordDto();

    Object.assign(dto, req.body);
    await validateOrReject(dto);

    const { token, newPassword } = dto;

    const decoded = await JwtAdapter.validateToken<{
      id: number;
      email: string;
    }>(token);

    if (!decoded || !decoded.id) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const hashedPassword = BcryptAdapter.hash(newPassword);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    throw CustomError.InternalServerError();
  }
};
