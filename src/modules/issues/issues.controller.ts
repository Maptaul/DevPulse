import type { NextFunction, Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { issueService } from "./issues.service";

const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await issueService.createIssueIntoDB(req.body);
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
    const result = await issueService.getAllIssuesFromDB();
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Issues retrieved successfully",
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
      message: "Issue retrieved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await issueService.updateIssueIntoDB(Number(req.params.id), req.body);
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
    const result = await issueService.deleteIssueFromDB(Number(req.params.id));
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Issue deleted successfully",
      data: result.rows[0],
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
