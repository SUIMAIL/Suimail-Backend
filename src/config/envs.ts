import dotenv from 'dotenv';

dotenv.config();

export const {
  PORT,
  MONGO_URI,
  CORS_ORIGIN,
  JWT_SECRET,
  JWT_EXPIRES,
  MONGO_DB_NAME,
  COINGECKO_API_KEY,
} = process.env;

const requiredEnvs = [
  PORT,
  MONGO_URI,
  CORS_ORIGIN,
  JWT_SECRET,
  JWT_EXPIRES,
  MONGO_DB_NAME,
  COINGECKO_API_KEY,
];

if (requiredEnvs.some(env => !env)) {
  throw new Error(`Missing environment variables: ${requiredEnvs.filter(env => !env).join(', ')}`);
}
