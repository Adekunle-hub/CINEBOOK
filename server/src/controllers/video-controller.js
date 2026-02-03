import Post from "../models/Post.js";
import logger from "../utils/logger.js";

export const searchPosts = async (req, res) => {
  logger.info("Search posts endpoint reached...");
  try {
    const { q } = req.query;
    
    console.log('Search query received:', q);
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ 
        error: "Query must be at least 2 characters",
        movies: [],
        total: 0
      });
    }

    const totalPosts = await Post.countDocuments();
    console.log('Total posts in DB:', totalPosts);

    // Use REGEX instead of $text (works without index)
    const posts = await Post.find({
      $or: [
        { title: { $regex: q.trim(), $options: 'i' } },
        { description: { $regex: q.trim(), $options: 'i' } },
        { genre: { $regex: q.trim(), $options: 'i' } }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

    console.log('Search results:', posts.length);
    console.log('First result:', posts[0]);

    // Transform to match frontend expectations
    const transformedPosts = posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      poster: post.image?.url || null,
      releaseYear: post.createdAt ? new Date(post.createdAt).getFullYear() : null,
      genre: Array.isArray(post.genre) ? post.genre : [post.genre].filter(Boolean),
      rating: post.rating || 0,
      description: post.description,
      duration: post.duration
    }));

    res.json({
      movies: transformedPosts,
      total: transformedPosts.length
    });

  } catch (error) {
    logger.error('Search error:', error);
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Failed to search posts',
      movies: [],
      total: 0
    });
  }
};