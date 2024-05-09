import express, {
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from "express";
import cors from "cors";
import morgan from "morgan";

import routes from "./routes";
import environmentConfig from "./config/env.config";

import { ValidationError } from "express-validation";

/**
 * create server setup
 *
 * @returns {Express}
 */
const app = express();
app.use(cors());
app.use(morgan(environmentConfig.env));
app.use(json());
app.use(urlencoded({ extended: true }));

// api routes
app.use("/api", routes);

// Error-handling
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ValidationError) {
    return res
      .status(err.statusCode)
      .json({ status: false, error: err.details });
  }

  return res.status(500).json({ status: false, error: err.message });
});

// route not-found error return
app.use((req: Request, res: Response) => {
  const apiResponse = {
    successful: false,
    message: "Route not found.",
  };
  return res.status(404).json(apiResponse);
});

export default app;
