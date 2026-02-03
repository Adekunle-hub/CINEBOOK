import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectToDb from "./database/db.js";
import userRoute from "./routes/user-route.js";
import videoRoute from "./routes/video-route.js"
import postRoute from "./routes/post-route.js"
import { authenticateToken } from "./middleware/authenticateUser.js";
import errorHandler from "./middleware/errorMiddleware.js";
import globalLimiter from "./utils/rateLimit.js";
import passport from "./config/passport.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(globalLimiter)
app.use(passport.initialize())
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
app.use(errorHandler)

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/auth", userRoute);
app.use("/upload", postRoute)
app.use("/search", videoRoute)

app.listen(PORT, async () => {
  await connectToDb();
  console.log(`App is running on PORT:${PORT}`);
});
