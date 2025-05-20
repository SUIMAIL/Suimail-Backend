declare global {
  namespace Express {
    interface Request {
      user?: { id: string }
    }
  }
}

export interface JWTPayload {
  sub: string
  version: number
  iat?: number
  exp?: number
}
