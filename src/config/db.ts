import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    dialect: "postgres",
    logging: false,
  },
);

const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log(`${new Date().toISOString()} - PostgreSQL connected`);
  } catch (err) {
    console.error("DB Connection Error:", (err as Error).message);
    process.exit(1);
  }
};

export { connectDatabase, sequelize };
