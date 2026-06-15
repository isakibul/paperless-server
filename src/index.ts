import http from "http";
import app from "./app";
import { connectDatabase } from "./config/db";
import env from "./config/env";

const PORT = env.port;

const startServer = async (): Promise<void> => {
  await connectDatabase();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(
      `${new Date().toISOString()} [INFO] Server running on PORT ${PORT}`,
    );
  });
};

void startServer();
