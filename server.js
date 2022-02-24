const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const hospitals = require("./routes/hospitals");
const auth = require("./routes/auth");

dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/hospitals", hospitals);
app.use("/api/v1/auth", auth);

const PORT = process.env.PORT || 6000;
const server = app.listen(
  PORT,
  console.log("Server running in ", process.env.NODE_ENV, " mode on port", PORT)
);

//handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
