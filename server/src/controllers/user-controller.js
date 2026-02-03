
import RefreshToken from "../models/RefreshToken.js";
import User from "../models/user.js";
import generateToken, { hashToken } from "../utils/generatetoken.js";
import logger from "../utils/logger.js";
import {
  validateRegistration,
  validateUserLogin,
} from "../validators/authValidators.js";
import passport from "../config/passport.js";


const redirectUri = process.env.NODE_ENV === 'production' 
  ? `${process.env.SERVER_URL}/auth/google/callback`
  : `http://localhost:${process.env.PORT}/auth/google/callback`;

googleAuthUrl.searchParams.append('redirect_uri', redirectUri);

//handle sign up
export const registerUser = async (req, res) => {
  logger.info("Hitting the registration endpoint");

  try {
    logger.info("request body", req.body);

    const { error, value } = validateRegistration(req.body);
    if (error) {
      logger.warn("validation error:", {
        message: error.details[0].message,
        field: error.details[0].path.join("."),
      });
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { fullName, email, password } = value;

    //check if this user has registered already
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn("User already exists", { email });
      return res.status(400).json({
        success: false,
        message: "User already exists, kindly login...",
      });
    }

    const user = new User({
      email,
      fullName,
      password,
    });

    await user.save();

    const { accessToken, refreshToken } = await generateToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },

      accessToken,
    });
  } catch (error) {
    logger.error("Registration error:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//Handle login user

export const loginUser = async (req, res) => {
  logger.info("Login user endpoint hit");
  try {
    const { error, value } = validateUserLogin(req.body);
    if (error) {
      logger.warn("validation error:", {
        message: error.details[0].message,
        field: error.details[0].path.join("."),
      });
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = value;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Username or password is not correct",
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(404).json({
        success: false,
        message: "Username or password is not correct",
      });
    }

    const { accessToken, refreshToken } = await generateToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
      success: true,
      message: "User logged in successsfully",
    });
  } catch (error) {
    logger.error("Logging in error:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//Handle log out user

export const logoutUser = async (req, res) => {
  logger.info("Logout endpoint hit...");
  // 👇 ADD THESE DEBUG LOGS
  console.log("All cookies:", req.cookies);
  console.log("All headers:", req.headers);
  console.log("Cookie header:", req.headers.cookie);
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      logger.warn("Refresh Token Missing");
      return res.status(400).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    await RefreshToken.deleteOne({ token: refreshToken });
    logger.info("Refresh token deleted for log out");

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to log out user",
    });
  }
};

//Refresh Access token
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const hashedToken = hashToken(refreshToken);

    const tokenDoc = await RefreshToken.findOne({
      token: hashedToken,
    }).populate("user");

    if (!tokenDoc) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Check if token is expired
    if (new Date() > tokenDoc.expiresAt) {
      await RefreshToken.deleteOne({ _id: tokenDoc._id });
      return res.status(401).json({ message: "Refresh token expired" });
    }

    // SECURITY: Check if token was already used (reuse detection)
    if (tokenDoc.isRevoked) {
      await RefreshToken.updateMany(
        { tokenFamily: tokenDoc.tokenFamily },
        { isRevoked: true },
      );

      res.clearCookie("refreshToken");
      return res.status(401).json({
        message: "Token reuse detected. Please log in again.",
      });
    }

    // Mark old token as used (revoked)
    await RefreshToken.updateOne({ _id: tokenDoc._id }, { isRevoked: true });

    // Generate NEW tokens (rotation)
    const { refreshToken: newRefreshToken, accessToken } = await generateToken(
      tokenDoc.user,
    );

    // Set new refresh token in cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Send new access token
    res.json({ accessToken: accessToken });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Get profile error", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const googleAuth = (req, res) => {
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  
  googleAuthUrl.searchParams.append('client_id', process.env.GOOGLE_CLIENT_ID);
googleAuthUrl.searchParams.append('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.append('response_type', 'code');
  googleAuthUrl.searchParams.append('scope', 'profile email');
  googleAuthUrl.searchParams.append('access_type', 'offline');
  googleAuthUrl.searchParams.append('prompt', 'consent');
  
  console.log('🔗 Redirecting to Google OAuth...');
  
  res.redirect(googleAuthUrl.toString());
};

export const googleAuthCallback = async (req, res) => {
  console.log("🎯 Google callback hit!");
  console.log("Query params:", req.query);
  
  const { code, error } = req.query;

  if (error) {
    logger.warn("Google OAuth error:", error);
    return res.redirect(`${process.env.CLIENT_URL}/login?error=${error}`);
  }

  if (!code) {
    logger.warn("No authorization code received");
    return res.redirect(`${process.env.CLIENT_URL}/login?error=no_code`);
  }

  try {
    console.log("📝 Exchanging code for tokens...");

    // Exchange authorization code for access token using fetch
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.SERVER_URL}/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData);
      throw new Error(tokenData.error_description || 'Token exchange failed');
    }

    const { access_token } = tokenData;
    console.log("🔑 Access token received!");

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const profile = await userInfoResponse.json();
    console.log("👤 User info received:", profile.email);

    // Check if user exists with Google ID
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      console.log("✅ Existing Google user found");
      logger.info("Existing Google user found", { userId: user._id });
    } else {
      // Check if user exists with email
      user = await User.findOne({ email: profile.email });

      if (user) {
        console.log("🔗 Linking Google account to existing user");
        // Link Google account to existing user
        user.googleId = profile.id;
        user.avatar = profile.picture;
        user.isEmailVerified = true;
        await user.save();
        logger.info("Google account linked to existing user", { userId: user._id });
      } else {
        console.log("🆕 Creating new user");
        // Create new user
        user = new User({
          googleId: profile.id,
          email: profile.email,
          fullName: profile.name,
          avatar: profile.picture,
          isEmailVerified: true,
        });

        await user.save();
        logger.info("New Google user created", { userId: user._id });
      }
    }

    // Generate tokens
    const { accessToken, refreshToken } = await generateToken(user);
    console.log("🎟️ Tokens generated");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, 
    });

   
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`;
    logger.info("Google authentication successful", { userId: user._id });
    
    console.log("✅ Redirecting to frontend:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    logger.error("Google callback error:", error.message);
    console.error("❌ Error details:", error.message, error.stack);
    res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
  }
};