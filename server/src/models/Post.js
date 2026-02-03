import mongoose, { model } from "mongoose";

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url: String,
    publicId: String,
  },
  images: [
    {
      url: String,
      publicId: String,
    },
  ],
  genre: {
    type: String,
    required: true,
  },
  rating: [{
    type: String,
    required: true,
  }],
  duration: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
