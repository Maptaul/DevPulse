import { pool } from "../../db";
import type { ICreateUserPayload } from "./user.interface";
import bcrypt from "bcryptjs";

const createUserIntoDB = async (payload: ICreateUserPayload) => {
  const { name, email, password, role } = payload;

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, COALESCE($4, 'contributor')) RETURNING *`,
    [name, email, hashPassword, role],
  );
  delete result.rows[0].password;
  return result;
};

const getAllUsersFromDB = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};

const updateUserFromDB = async (payload: ICreateUserPayload, id: string) => {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  }
  
  const result = await pool.query(
    `UPDATE users SET name =COALESCE($1, name), password = COALESCE($2, password),role = COALESCE($3, role) WHERE id = $4 RETURNING * `,
    [payload.name, payload.password, payload.role, id],
  );
  delete result.rows[0].password;
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING *`,
    [id],
  );
  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserFromDB,
  deleteUserFromDB,
};
