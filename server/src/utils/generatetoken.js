import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "../models/RefreshToken.js";

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const generateToken = async (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name:user.name
    },
    process.env.JWT_SECRET,
    { expiresIn: "60m" },
  );

  const refreshToken = crypto.randomBytes(40).toString("hex");
  const hashedToken = hashToken(refreshToken);
  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 7);
   const tokenFamily = crypto.randomBytes(20).toString("hex");

  await RefreshToken.create({
    token: hashedToken,
    user: user._id,
    expiresAt,
    tokenFamily,
    isRevoked: false,
  });

  return { refreshToken, accessToken };
};

export default generateToken;
