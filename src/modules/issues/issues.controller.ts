import type { NextFunction } from "express";
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

export const issueController = {
        createIssue,
};