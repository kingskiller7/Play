import jwt from "jsonwebtoken";
import env from "./env.js";
import { v4 as uuidv4 } from 'uuid';

class JWT {
  static async generateToken(user, tokenType) {
    let secret;
    let expiresIn;
    let payload = {
      id: user._id.toString(),
      role: user.role,
    };
    if (tokenType === "accessToken") {
      secret = env.JWT_SECRET;
      expiresIn = 60 * 60;
    } else if (tokenType === "refreshToken") {
      secret = uuidv4();
      expiresIn = 7 * 24 * 60 * 60;
    } else {
      throw new Error("Invalid token type");
    }

    try {
      const token = jwt.sign(payload, secret, { expiresIn });
      return token;
    } catch (err) {
      throw new Error("Token generation failed: " + err.message);
    }
  };

  static async verifyToken(token, tokenType) {
    const secret = tokenType === "accessToken" ? env.JWT_SECRET : env.JWT_REFRESH_SECRET;
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      throw new Error("Token verification failed: " + err.message);
    }
  };
}

export default JWT;