const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const hospitals = require("./routes/hospitals");
const appointments = require("./routes/appointments");
const auth = require("./routes/auth");

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "Hospital API Documentation",
    },
    servers: [
      {
        url: "http://localhost:5050/api/v1",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(express.json());

app.use(cookieParser());

// //Sanitize data path
// app.use(mongoSanitize());

app.use(helmet());

app.use(xss());

app.use("/api/v1/hospitals", hospitals);
app.use("/api/v1/auth", auth);
app.use("/api/v1/appointments", appointments);

const PORT = process.env.PORT || 5050;
const server = app.listen(
  PORT,
  console.log("Server running in ", process.env.NODE_ENV, " mode on port", PORT)
);

//handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(err.red, promise);
  server.close(() => process.exit(1));
});
