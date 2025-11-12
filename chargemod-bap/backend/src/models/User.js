import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    avatarUrl: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pinCode: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
