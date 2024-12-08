require("./instrument.js");

import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "src/middleware/error.handler";
import morgan from "morgan";
import * as Sentry from "@sentry/node";
// Routers
import authRouter from "src/auth";
import usersRouter from "src/users";
import climbingrouteRouter from "src/climbingroute";
import logger from "src/utils/logger";

const app = express();
dotenv.config();
app.use(express.json());
// Logger
const morganStream = {
  write: (message: string): void => {
    logger.info(message.trim());
  },
};

app.use(morgan("dev", { stream: morganStream }));

app.use("/auth", authRouter);
app.use("/climbingroutes", climbingrouteRouter);
app.use("/users", usersRouter);

Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Example app listening on port ${PORT}`);
});
