import Joi from "joi";

export const validateRegistration = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().lowercase().trim().messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "An email is required",
      "any.required": "Email is required",
    }),
    fullName: Joi.string().min(2).max(50).required().trim().messages({
      "string.min": "Full name must be at least 2 characters long",
      "string.max": "Full name must not exceed 50 characters",
      "string.empty": "Full name is required",
      "string.any": "Full name is required",
    }),
    password: Joi.string().min(6).max(128).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password must not exceed 128 characters",
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  });
  return schema.validate(data);
};

export const validateUserLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().lowercase().trim().messages({
      "string.email": "Please provide a valid email address",
      "string.empty": "An email is required",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).max(128).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "string.max": "Password must not exceed 128 characters",
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
  });
  return schema.validate(data);
};
