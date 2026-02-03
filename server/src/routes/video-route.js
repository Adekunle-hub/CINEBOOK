import { Router } from "express";
import { upload, cloudinary } from "../config/cloudinary.js";
import { searchPosts } from "../controllers/video-controller.js";


const router = Router()
router.get("/", searchPosts)

export default router