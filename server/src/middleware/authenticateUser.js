import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

export const authenticateToken = ( req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      logger.warn("No access token");
      return res.status(400).json({
        success: false,
        message: "Access token is required",
      });
    }

    //verify token

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        logger.warn("Token verification failed", err);

        if (err.name === "TokenExpiredError") {
          return res.status(400).json({
            success: false,
            message: "Acces Token expired",
          });
        }
        return res.status(403).json({
          success: false,
          message: "Invalid access token",
        });
      }

      req.user = {
        userId: decoded.userId,
        email: decoded.email,
      };

      next();
    });
  } catch (error) {
    logger.error("Auth middleware error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
