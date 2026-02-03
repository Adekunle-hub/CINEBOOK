import passport from "passport";
import pkg from "passport-google-oauth20";
import User from "../models/user.js";
import logger from "../utils/logger.js";

const { Strategy: GoogleStrategy } = pkg;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:5000/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        logger.info("Google OAuth Callback hit", { profileId: profile.id });

        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          logger.info("Exixting user found", { userId: user._id });
          return done(null, user);
        }

        user = await User.findOne({ email: profile.email[0].value });
        if (user) {
          user.googleId = profile.id;
          user.avatar = profile.photos[0]?.value;
          await user.save();
          logger.info("Google account linked to existing users", {
            userId: user._id,
          });
          return done(null, user);
        }

        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          fullName: profile.displayName,
          avatar: profile.photos[0]?.value,
          isEmailVerified: true,
        });
        await user.save();

        logger.info("New Google user created", { userId: user._id });

        return done(null, user);
      } catch (error) {
        logger.error("Google OAuth error:", error);
        return done(error, null);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
