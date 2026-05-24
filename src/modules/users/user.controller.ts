import type { Request, Response, NextFunction } from "express";
import { pool } from "../../db";
import sendResponse from "../../utility/sendResponse";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  //   const { name, email, password, role } = req.body;
  try {
    const result = await userService.createUserIntoDB(req.body);
    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getAllUsersFromDB();
    sendResponse(res, {
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserFromDB(id as string);
    if (result.rows.length === 0) {
      return sendResponse(res, {
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }
    sendResponse(res, {
      success: true,
      message: "User retrieved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const result = await userService.updateUserFromDB(req.body, id as string);
    if (result.rows.length === 0) {
      return sendResponse(res, {
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }
    sendResponse(res, {
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};


const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserFromDB(id as string);
    if (result.rows.length === 0) {
      return sendResponse(res, {
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    }
    sendResponse(res, {
      success: true,
      message: "User deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};
