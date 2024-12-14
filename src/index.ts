require("./instrument.js");

import express from "express";
import dotenvx from "@dotenvx/dotenvx";
import { errorHandler } from "src/middleware/error.handler";
import morgan from "morgan";
import * as Sentry from "@sentry/node";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerOptions from "src/config/swagger";
import logger from "src/utils/logger";
import cors, { CorsOptionsDelegate } from "cors";
import fs from "fs";

// Routers
import authRouter from "src/auth";
import usersRouter from "src/users";
import climbingrouteRouter from "src/climbingroute";
import mediaRouter from "src/media";

const corsConfig: { allowedOrigins: string[] } = JSON.parse(
  fs.readFileSync("./cors-config.json", "utf8"),
);
const allowedOrigins = corsConfig.allowedOrigins;

const app = express();

dotenvx.config();
app.use(express.json());
// Dynamic CORS middleware
type CorsOptions = {
  origin: boolean;
  credentials?: boolean;
};

const corsOptionsDelegate: CorsOptionsDelegate = (
  req,
  callback: (err: Error | null, options: CorsOptions) => void,
): void => {
  let corsOptions: CorsOptions = {
    origin: false,
    credentials: false,
  };
  const origin: string | undefined = req.headers.origin;

  if (!origin) {
    corsOptions = { credentials: false, origin: false };
  } else if (allowedOrigins.includes(origin)) {
    corsOptions = { credentials: true, origin: true }; // Allow this origin
  } else {
    corsOptions = { origin: false, credentials: false }; // Block this origin
  }

  callback(null, corsOptions); // Pass options to the cors middleware
};

// Apply CORS
app.use(cors(corsOptionsDelegate));

// Logger
const morganStream = {
  write: (message: string): void => {
    logger.info(message.trim());
  },
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  // TODO: figure out how to fix this type of middleware issue. might need to manually handle the types
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
app.use(morgan("dev", { stream: morganStream }));

app.use("/auth", authRouter);
app.use("/climbingroutes", climbingrouteRouter);
app.use("/users", usersRouter);
app.use("/media", mediaRouter);

Sentry.setupExpressErrorHandler(app);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Example app listening on port ${PORT}`);
});

export default app;
