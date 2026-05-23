import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../db";
import type { ILoginPayload, ISignupPayload } from "./auth.interface";
import config from "../../config";

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

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.secret as string, {
    expiresIn: "1h",
  });

  return { user, accessToken };
};

export const authService = {
  signupUserIntoDB,
  loginUserIntoDB,
};
