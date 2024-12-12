import { config } from "dotenv";

config();

const env = {
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/play',
  CLIENT_URL: process.env.CLIENT_URL || 'https://play-alpha-one.vercel.app/',
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
  PORT: process.env.PORT || 5000,
  EMAIL: process.env.EMAIL || 'abdulmustafa124@gmail.com',
  PASSWORD: process.env.PASSWORD || 'default_email_password',
};

export default env;