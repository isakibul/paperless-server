import cors from "cors";
import express from "express";
import morgan from "morgan";
import v1Routes from "./routes/v1";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use("/api/v1", v1Routes);

export default app;
