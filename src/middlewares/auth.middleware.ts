import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config/envs"
import { JWTPayload } from "../types/global"
import { UnauthorizedError } from "../utils/AppError"
import { UserService } from "../api/user/user.service"

const userService = new UserService()

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.header("Authorization")

  if (!authHeader) {
    next(new UnauthorizedError("Authorization header is missing"))
    return
  }

  if (!authHeader.startsWith("Bearer ")) {
    next(
      new UnauthorizedError(
        "Invalid authorization format. Use 'Bearer <token>'"
      )
    )
    return
  }

  const token = authHeader.replace("Bearer ", "")

  if (!JWT_SECRET) {
    next(new Error("JWT_SECRET is not configured"))
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload

    if (!decoded.sub) {
      next(new UnauthorizedError("Invalid token payload"))
      return
    }

    const user = await userService.findById(decoded.sub)

    if (!user) {
      next(new UnauthorizedError("User not found"))
      return
    }

    if (decoded.version !== user.authTokenVersion) {
      next(new UnauthorizedError("Invalid token"))
      return
    }

    req.user = { id: decoded.sub }
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
