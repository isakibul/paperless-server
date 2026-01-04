require("dotenv").config();
const http = require("http");
const app = require("./app");
const { connectDatabase } = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDatabase();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(
    `${new Date().toISOString()} [INFO] Server running on PORT ${PORT}`
  );
});
