import dotenv from "dotenv";
import http from "http";
import app from "./app";
import { connectDatabase } from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDatabase();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(
    `${new Date().toISOString()} [INFO] Server running on PORT ${PORT}`,
  );
});
