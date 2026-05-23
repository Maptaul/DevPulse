import { pool } from "../../db";
import type { ICreateUserPayload } from "./user.interface";

const createUserIntoDB = async (payload: ICreateUserPayload) => {
  const { name, email, password, role } = payload;
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, password, role],
  );
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
  const { name, password, role } = payload;
  const result = await pool.query(
    `UPDATE users SET name =COALESCE($1, name), password = COALESCE($2, password),role = COALESCE($3, role) WHERE id = $4 RETURNING * `,
    [name, password, role, id],
  );
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
