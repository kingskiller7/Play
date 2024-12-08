import { config } from "dotenv";

config();

const env = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/play',
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
  PORT: process.env.PORT || 5000,
};

export default env;