import type { NextFunction, Request, Response } from "express";
import AppError from "../utility/AppError";

const globalErrorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default globalErrorHandler;
