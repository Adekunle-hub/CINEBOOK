import express, { Router } from "express";
import { upload, cloudinary } from "../config/cloudinary.js";

import {
  getPost,
  getPosts,
  sendImage,
  uploadMultipleImages,
} from "../controllers/post-controller.js";

const router = Router();

router.post("/post", upload.single("image"), sendImage);
router.post("/posts", upload.array("image", 5), uploadMultipleImages);
router.get("/posts", getPosts);
router.get("/posts/:id", getPost);

export default router;
