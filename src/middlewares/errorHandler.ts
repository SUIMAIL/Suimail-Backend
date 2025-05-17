import { Request, Response, NextFunction, ErrorRequestHandler } from "express"
import logger from "../config/logger"
import { AppError } from "../utils/AppError"

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("ErrorHandler")

  if (!(err instanceof AppError)) {
    err = new AppError(500, err.message || "Something went wrong")
  }

  const appError = err as AppError
  const logLevel = appError.statusCode >= 500 ? "error" : "warn"

  logger.log(logLevel, {
    type: appError.constructor.name,
    statusCode: appError.statusCode,
    message: appError.message,
    details: appError.details,
    path: req.path,
    method: req.method,
  })

  res.status(appError.statusCode).json({
    status: appError.status,
    message: appError.message,
    ...(appError.details && { details: appError.details }),
  })
}
