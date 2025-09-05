require("dotenv").config();
const http = require("http");
const app = require("./app");
const dbConnection = require("./db/dbConnection");

const PORT = process.env.PORT || 3000;

dbConnection();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(
    `${new Date().toISOString()} [INFO] Server running on PORT ${PORT}`
  );
});
