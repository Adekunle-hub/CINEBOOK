import Post from "../models/Post.js";
import logger from "../utils/logger.js";

export const sendImage = async (req, res) => {
  logger.info("Sending post endpoint reached...");
  try {
    const { title, description, genre, rating, duration } = req.body;
    const newPost = new Post({
      title,
      description,
      image: {
        url: req.file.path,
        publicId: req.file.filename,
      },
      genre,
      rating,
      duration
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const uploadMultipleImages = async (req, res) => {
  logger.info("Sending multiple images endpoint");
  try {
    const { title, description } = req.body;
    const images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    const newPost = new Post({
      title,
      description,
      images,
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const getPosts = async (req, res) => {
  logger.info("Get all images endpoint reached...")
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPost = async (req, res) => {
  console.log("Checking");
  logger.info("Searching for a particular post endpont reached...");
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json("post not found");
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
