import { pool } from "../../db";
import type {
  ICreateIssuePayload,
  IUpdateIssuePayload,
} from "./issues.interface";

const createIssueIntoDB = async (payload: ICreateIssuePayload) => {
  const { title, description, type, status = "open", reporter_id } = payload;

  const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    reporter_id,
  ]);

  if (user.rows.length === 0) {
    throw new Error("Reporter not found");
  }
  const result = await pool.query(
    `INSERT INTO issues (title, description, type, status, reporter_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, description, type, status, reporter_id],
  );

  return result;
};

const getAllIssuesFromDB = async () => {
  const result = await pool.query(
    `SELECT * FROM issues ORDER BY created_at DESC`,
  );
  return result;
};

const getIssueByIdFromDB = async (id: number) => {
  const result = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);

  if (result.rows.length === 0) {
    throw new Error("Issue not found");
  }

  return result;
};

const updateIssueIntoDB = async (id: number, payload: IUpdateIssuePayload) => {
  const existing = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);

  if (existing.rows.length === 0) {
    throw new Error("Issue not found");
  }

  const { title, description, type, status } = payload;

  const result = await pool.query(
    `UPDATE issues
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         type = COALESCE($3, type),
         status = COALESCE($4, status),
         updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [title, description, type, status, id],
  );

  return result;
};

const deleteIssueFromDB = async (id: number) => {
  const existing = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);

  if (existing.rows.length === 0) {
    throw new Error("Issue not found");
  }

  const result = await pool.query(
    `DELETE FROM issues WHERE id = $1 RETURNING *`,
    [id],
  );

  return result;
};

export const issueService = {
  createIssueIntoDB,
  getAllIssuesFromDB,
  getIssueByIdFromDB,
  updateIssueIntoDB,
  deleteIssueFromDB,
};
