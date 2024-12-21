import jwt from "jsonwebtoken";
import env from "./env.js";

class JWT {
  static async generateToken(user, tokenType) {
    let secret;
    let expiresIn;
    let payload = {
      id: user._id.toString(),
      role: user.role,
    };
    if (tokenType === "accessToken") {
      secret = env.JWTSecret;
      expiresIn = 60 * 60;
    } else if (tokenType === "refreshToken") {
      secret = env.JWTRefreshSecret
      expiresIn = 7 * 24 * 60 * 60;
    } else {
      throw new Error("Invalid token type");
    }

    try {
      const token = jwt.sign(payload, secret, { expiresIn });
      console.log(token);
      return token;
    } catch (err) {
      throw new Error("Token generation failed: " + err.message);
    }
  };

  static async verifyToken(token, tokenType) {
    const secret = tokenType === "accessToken" ? env.JWTSecret : env.JWTRefreshSecret;
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      throw new Error("Token verification failed: " + err.message);
    }
  };
}

export default JWT;