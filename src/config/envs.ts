import dotenv from "dotenv"

dotenv.config()

export const { PORT, MONGO_URI, CORS_ORIGIN, JWT_SECRET, MAIL_FEE } =
  process.env

const requiredEnvs = [PORT, MONGO_URI, CORS_ORIGIN, JWT_SECRET, MAIL_FEE]

if (requiredEnvs.some((env) => !env)) {
  throw new Error(
    `Missing environment variables: ${requiredEnvs
      .filter((env) => !env)
      .join(", ")}`
  )
}
