import dotenv from "dotenv";

dotenv.config();

const config = {
  connection_string: process.env.CONNECTION_STRING,
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
};

export default config;
