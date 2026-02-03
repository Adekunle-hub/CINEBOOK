import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: { required: true, unique: true, type: String },
    expiresAt: {
      type: Date,
      required: true,
    },
     tokenFamily: {
    type: String,
    default: null,
  },
  isRevoked: {
    type: Boolean,
    default: false,
  }
  },
  { timestamps: true }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
