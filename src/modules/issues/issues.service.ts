import { pool } from "../../db";
import type {
  ICreateIssuePayload,
  IUpdateIssuePayload,
} from "./issues.interface";
import AppError from "../../utility/AppError";

const VALID_TYPES = ["bug", "feature_request"];
const VALID_STATUSES = ["open", "in_progress", "resolved"];

const createIssueIntoDB = async (payload: ICreateIssuePayload) => {
  const { title, description, type, status = "open", reporter_id } = payload;

  if (!title || title.trim().length === 0) {
    throw new AppError("Title is required", 400);
  }
  if (title.length > 150) {
    throw new AppError("Title must be at most 150 characters", 400);
  }
  if (!description || description.trim().length === 0) {
    throw new AppError("Description is required", 400);
  }
  if (description.length < 20) {
    throw new AppError("Description must be at least 20 characters", 400);
  }
  if (!VALID_TYPES.includes(type)) {
    throw new AppError("Type must be bug or feature_request", 400);
  }

  const user = await pool.query(`SELECT * FROM users WHERE id = $1`, [
    reporter_id,
  ]);

  if (user.rows.length === 0) {
    throw new AppError("Reporter not found", 404);
  }

  const result = await pool.query(
    `INSERT INTO issues (title, description, type, status, reporter_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, description, type, status, reporter_id],
  );

  return result;
};

const getAllIssuesFromDB = async (filters: {
  type?: string;
  status?: string;
  sort?: string;
}) => {
  const conditions: string[] = [];
  const values: string[] = [];

  if (filters.type) {
    values.push(filters.type);
    conditions.push(`type = $${values.length}`);
  }

  if (filters.status) {
    values.push(filters.status);
    conditions.push(`status = $${values.length}`);
  }

  const where =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const order = filters.sort === "oldest" ? "ASC" : "DESC";

  const issuesResult = await pool.query(
    `SELECT * FROM issues ${where} ORDER BY created_at ${order}`,
    values,
  );

  const issues = issuesResult.rows;

  if (issues.length === 0) return { rows: [] };

  const reporterIds = [...new Set(issues.map((i) => i.reporter_id))];
  const reportersResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1)`,
    [reporterIds],
  );

  const reporterMap = new Map(reportersResult.rows.map((r) => [r.id, r]));

  const rows = issues.map(({ reporter_id, ...issue }) => ({
    ...issue,
    reporter: reporterMap.get(reporter_id) ?? null,
  }));

  return { rows };
};

const getIssueByIdFromDB = async (id: number) => {
  const result = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);

  if (result.rows.length === 0) {
    throw new AppError("Issue not found", 404);
  }

  const { reporter_id, ...issue } = result.rows[0];

  const reporterResult = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [reporter_id],
  );

  return {
    rows: [{ ...issue, reporter: reporterResult.rows[0] ?? null }],
  };
};

const updateIssueIntoDB = async (id: number, payload: IUpdateIssuePayload) => {
  const existing = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);

  if (existing.rows.length === 0) {
    throw new AppError("Issue not found", 404);
  }

  const { title, description, type } = payload;

  if ("status" in payload) {
    throw new AppError("Status cannot be updated through this endpoint", 400);
  }

  if (title !== undefined && title.length > 150) {
    throw new AppError("Title must be at most 150 characters", 400);
  }
  if (description !== undefined && description.length < 20) {
    throw new AppError("Description must be at least 20 characters", 400);
  }
  if (type !== undefined && !VALID_TYPES.includes(type)) {
    throw new AppError("Type must be bug or feature_request", 400);
  }

  const result = await pool.query(
    `UPDATE issues
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         type = COALESCE($3, type),
         updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [title, description, type, id],
  );

  return result;
};

const deleteIssueFromDB = async (id: number) => {
  const existing = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);

  if (existing.rows.length === 0) {
    throw new AppError("Issue not found", 404);
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
