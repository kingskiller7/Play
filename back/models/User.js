import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    permissions: {
      type: [String],
      default: []
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;