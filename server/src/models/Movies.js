import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    poster: {
      url: {
        type: String,
        required: [true, 'Poster URL is required'],
      },
      publicId: {
        type: String,
        required: [true, 'Poster public ID is required'],
      },
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required'],
     
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ genre: 1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ rating: -1 });

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

export default Movie;