import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "JWT_SECRET",
] as const;

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
}

const getRequiredEnv = (key: (typeof requiredEnvVars)[number]): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const dbPort = parseInt(process.env.DB_PORT || "5432", 10);

if (Number.isNaN(dbPort)) {
  throw new Error("DB_PORT must be a valid number");
}

const env = {
  db: {
    name: getRequiredEnv("DB_NAME"),
    user: getRequiredEnv("DB_USER"),
    password: getRequiredEnv("DB_PASSWORD"),
    host: getRequiredEnv("DB_HOST"),
    port: dbPort,
  },
  jwtSecret: getRequiredEnv("JWT_SECRET"),
  port: process.env.PORT || "5000",
};

export default env;
