import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";
import type { ILoginPayload, ISignupPayload } from "./auth.interface";
import config from "../../config";
import { generateAccessToken, generateTokens, type TTokenPayload } from "../../utility/tokenGenerator";
import AppError from "../../utility/AppError";

const signupUserIntoDB = async (payload: ISignupPayload) => {
  const { name, email, password, role = "contributor" } = payload;

  const existing = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (existing.rows.length > 0) {
    throw new AppError("Email already in use", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at, updated_at`,
    [name, email, hashedPassword, role],
  );

  return result;
};

const loginUserIntoDB = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const userData = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (userData.rows.length === 0) {
    throw new AppError("Invalid email or password", 401);
  }

  const user = userData.rows[0];
  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new AppError("Invalid email or password", 401);
  }

  const jwtPayload: TTokenPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
  };

  const { accessToken, refreshToken } = generateTokens(jwtPayload);

  const { password: _, ...userWithoutPassword } = user;

  return { accessToken, refreshToken, user: userWithoutPassword };
};

const generateRefreshToken = async (token: string) => {
  if (!token) {
    throw new AppError("Unauthorized", 401);
  }

  const decoded = jwt.verify(
    token,
    config.refresh_secret as string,
  ) as JwtPayload;

  const userData = await pool.query("SELECT * FROM users WHERE email = $1", [
    decoded.email,
  ]);

  if (userData.rows.length === 0) {
    throw new AppError("User not found", 404);
  }

  const user = userData.rows[0];

  const jwtPayload: TTokenPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
  };

  const accessToken = generateAccessToken(jwtPayload);
  return { accessToken };
};

export const authService = {
  signupUserIntoDB,
  loginUserIntoDB,
  generateRefreshToken,
};
