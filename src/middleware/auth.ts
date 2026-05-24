import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { ROLES } from "../types";

const auth = (roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }

      const decoded = jwt.verify(
        token as string,
        config.secret as string,
      ) as JwtPayload;

      const userData = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [decoded.email],
      );

      if (userData.rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const user = userData.rows[0];

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ success: false, message: "Token expired" });
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ success: false, message: "Invalid token" });
      }
      next(error);
    }
  };
};

export default auth;
