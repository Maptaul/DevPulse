import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";
import type { ILoginPayload, ISignupPayload } from "./auth.interface";
import config from "../../config";
import { generateAccessToken, generateTokens, type TTokenPayload } from "../../utility/tokenGenerator";

const signupUserIntoDB = async (payload: ISignupPayload) => {
  const { name, email, password, role = "contributor" } = payload;

  const existing = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (existing.rows.length > 0) {
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
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
    throw new Error("Invalid email or password");
  }

  const user = userData.rows[0];
  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("Invalid email or password");
  }

  const jwtPayload: TTokenPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    email: user.email,
  };

  const { accessToken, refreshToken } = generateTokens(jwtPayload);

  return { accessToken, refreshToken };
};

const generateRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = jwt.verify(
    token,
    config.refresh_secret as string,
  ) as JwtPayload;

  const userData = await pool.query("SELECT * FROM users WHERE email = $1", [
    decoded.email,
  ]);

  if (userData.rows.length === 0) {
    throw new Error("User not found");
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
