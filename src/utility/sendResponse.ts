import type { Response } from "express";

type TResponseData<T> = {
  statusCode?: number;
  message?: string;
  success: boolean;
  data?: T;
  error?: any;
};

const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
  res.status(data.statusCode || 200).json({
    success: data.success,
    message: data.message || "Operation completed successfully",
    data: data.data,
    error: data.error,
  });
};

export default sendResponse;
