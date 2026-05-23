import type { Request, Response, NextFunction } from "express";
import sendResponse from "../../utility/sendResponse";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  loginUser,
};
