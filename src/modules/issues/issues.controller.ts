import type { NextFunction, Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { issueService } from "./issues.service";

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await issueService.createIssueIntoDB({
      ...req.body,
      reporter_id: req.user?.id,
    });
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const getAllIssues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const type = req.query.type as string | undefined;
    const status = req.query.status as string | undefined;
    const sort = req.query.sort as string | undefined;
    const result = await issueService.getAllIssuesFromDB({
      ...(type && { type }),
      ...(status && { status }),
      ...(sort && { sort }),
    });
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Issues retrived successfully",
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

const getIssueById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await issueService.getIssueByIdFromDB(Number(req.params.id));
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Issue retrived successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const existing = await issueService.getIssueByIdFromDB(id);
    const issue = existing.rows[0];

    const user = req.user;

    if (user?.role === "contributor") {
      if (issue.reporter?.id !== user.id) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      if (issue.status !== "open") {
        return res.status(409).json({ success: false, message: "Only open issues can be updated" });
      }
    }

    const result = await issueService.updateIssueIntoDB(id, req.body);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Issue updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await issueService.deleteIssueFromDB(Number(req.params.id));
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const issueController = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
};
