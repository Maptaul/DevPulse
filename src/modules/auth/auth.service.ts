import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../../db";
import type { ILoginPayload } from "./auth.interface";
import config from "../../config";

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
  loginUserIntoDB,
};
