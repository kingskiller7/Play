import { config } from "dotenv";
import bcrypt from "bcryptjs";

config();

const env = {
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/play',
  CLIENT_URL: process.env.CLIENT_URL || 'https://play-alpha-one.vercel.app/',
  JWTSecret: process.env.JWT_SECRET || 'c25f77428bd3a7b8c93837aa77d2d2b4c9d80cfa2668a32c620157c12b3de8a882be38051d883b5b6b000f67f12db56cb35cb5fffe8c3c3f65482ea543949a0deddd1c6c9694f4cf4994278ba2972e3eaf4a04675ed92aaa763a81900c72d4faf513410ef066ad51d2a715923efc1f852718bfc7a63965bd904ad311d47d6d06',
  JWTRefreshSecret: bcrypt.hashSync(
    bcrypt.genSaltSync(15),
    bcrypt.genSaltSync(15)
  ),
  PORT: process.env.PORT || 5000,
  EMAIL: process.env.EMAIL || 'abdulmustafa124@gmail.com',
  PASSWORD: process.env.PASSWORD || 'default_email_password',
};

export default env;