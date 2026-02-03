import Joi from "joi";

// Validate just the genre
export const validateGenre = (genre) => {
  const schema = Joi.array()
    .items(Joi.string().trim())
    .min(1)
    .required()
    .messages({
      "array.min": "At least one genre is required",
      "array.base": "Genre must be an array",
      "any.required": "Genre is required",
    });

  return schema.validate(genre);
};

// Validate the entire movie object
export const validateMovie = (movie) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(1).max(200).required().messages({
      "string.empty": "Movie title is required",
      "string.max": "Title cannot exceed 200 characters",
      "any.required": "Movie title is required",
    }),

    poster: Joi.object({
      url: Joi.string().uri().required().messages({
        "string.uri": "Poster URL must be a valid URL",
        "any.required": "Poster URL is required",
      }),
      publicId: Joi.string().required().messages({
        "any.required": "Poster public ID is required",
      }),
    }).required(),

    rating: Joi.number().min(0).max(10).default(0).messages({
      "number.min": "Rating must be at least 0",
      "number.max": "Rating cannot exceed 10",
    }),

    genre: Joi.array().items(Joi.string().trim()).min(1).required().messages({
      "array.min": "At least one genre is required",
      "any.required": "Genre is required",
    }),

    duration: Joi.number().integer().min(1).required().messages({
      "number.min": "Duration must be at least 1 minute",
      "any.required": "Duration is required",
    }),

    description: Joi.string().trim().min(10).max(1000).required().messages({
      "string.min": "Description must be at least 10 characters",
      "string.max": "Description cannot exceed 1000 characters",
      "any.required": "Description is required",
    }),

    releaseDate: Joi.date().required().messages({
      "date.base": "Release date must be a valid date",
      "any.required": "Release date is required",
    }),

    images: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          publicId: Joi.string().required(),
        }),
      )
      .optional(),
  });

  return schema.validate(movie, { abortEarly: false });
};

// Validate movie update (all fields optional)
export const validateMovieUpdate = (movie) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(1).max(200).optional(),

    poster: Joi.object({
      url: Joi.string().uri().required(),
      publicId: Joi.string().required(),
    }).optional(),

    rating: Joi.number().min(0).max(10).optional(),

    genre: Joi.array().items(Joi.string().trim()).min(1).optional(),

    duration: Joi.number().integer().min(1).optional(),

    description: Joi.string().trim().min(10).max(1000).optional(),

    releaseDate: Joi.date().optional(),

    images: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          publicId: Joi.string().required(),
        }),
      )
      .optional(),
  }).min(1);

  return schema.validate(movie, { abortEarly: false });
};
