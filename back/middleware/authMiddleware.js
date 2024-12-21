import JWT from "../config/jwt.js";
import User from "../models/User.js";

const authMid = {
  async authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: Missing or malformed token",
        });
      }

      const token = authHeader.split(" ")[1];
      const decoded = await JWT.verifyToken(token, "accessToken");

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: User not found"
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Authentication error:", error.message || error);
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token"
      });
    }
  },

  async authorize(roles) {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          error: "Forbidden: Insufficient permissions."
        });
      }
      next();
    };
  }
}

export default authMid;