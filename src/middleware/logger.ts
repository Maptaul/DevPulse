import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toLocaleString();

  const logMessage = `
========================================
Time   : ${timestamp}
Method : ${req.method}
URL    : ${req.originalUrl}
IP     : ${req.ip}
========================================
`;

  fs.appendFile("server.log", logMessage, (err) => {
    if (err) {
      console.error("❌ Failed to write log:", err);
    }
  });

  // console.log(`📌 ${req.method} ${req.originalUrl}`);

  next();
};

export default logger;
