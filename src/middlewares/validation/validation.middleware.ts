import { Request, Response, NextFunction } from "express"
import joi from "joi"
import { AppError } from "../../utils/AppError"

export const validateRequest = (
  schema: joi.Schema,
  property: "query" | "body" | "params"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property as keyof Request], {
      abortEarly: false,
    })

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ")
      return next(new AppError(400, message))
    }

    next()
  }
}
