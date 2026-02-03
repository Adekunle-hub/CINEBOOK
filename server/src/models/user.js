import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: function() {
        // Password is only required if googleId is not present
        return !this.googleId;
      },
    }, 
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values
    },
    avatar: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Pre-save hook to hash password
userSchema.pre("save", async function () {
  // Only hash the password if it exists and is new or modified
  if (!this.isModified("password") || !this.password) {
    return; // ✅ Just return, no next() needed in newer Mongoose
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (userPassword) {
  if (!this.password) return false; // Handle Google users who don't have passwords
  return bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;