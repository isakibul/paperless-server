import { Sequelize } from "sequelize";
import env from "./env";

const sequelize = new Sequelize(
  env.db.name,
  env.db.user,
  env.db.password,
  {
    host: env.db.host,
    port: env.db.port,
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
