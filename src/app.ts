import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";

import CookieParser from "cookie-parser";
import cors from "cors";

import globalErrorHandler from "./middleware/globalError";
import sendResponse from "./utility/sendResponse";
import { userRoute } from "./modules/users/user.route";
import { issueRoute } from "./modules/issues/issues.route";
import { authRoute } from "./modules/auth/auth.route";
import logger from "./middleware/logger";

const app: Application = express();

app.use(express.json());

app.use(CookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);

app.use(logger);

app.get("/", (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    message: "Hello, DevPulse World!",
    data: { author: "Maptaul Islam Taraq" },
  });
});

app.use("/api/users", userRoute);
app.use("/api/issues", issueRoute);
app.use("/api/auth", authRoute);

app.use(globalErrorHandler);

export default app;
