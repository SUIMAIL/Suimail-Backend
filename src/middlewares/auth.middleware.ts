import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/envs"
import { UnauthorizedError } from "../utils/AppError"

interface JWTPayload {
  address: string
  iat?: number
  exp?: number
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload
    }
  }
}

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header("Authorization")

  if (!authHeader) {
    next(new UnauthorizedError("Authorization header is missing"))
    return
  }

  if (!authHeader.startsWith("Bearer ")) {
    next(new UnauthorizedError("Invalid authorization format. Use 'Bearer <token>'"))
    return
  }

  const token = authHeader.replace("Bearer ", "")

  if (!JWT_SECRET) {
    next(new Error("JWT_SECRET is not configured"))
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload

    if (!decoded.address) {
      next(new UnauthorizedError("Invalid token payload"))
      return
    }

    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError("Invalid token"))
      return
    }
    if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError("Token has expired"))
      return
    }
    next(error)
  }
}

export default authMiddleware
