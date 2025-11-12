import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    let user = await User.findOne({ userId });
    if (!user) {
      // Auto-create a default profile if not found
      user = await User.create({
        userId,
        name: "EV User",
        email: `${userId}@example.com`,
        phone: "",
        avatarUrl: "",
        address: {},
      });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Get user profile error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get user profile" });
  }
};

export const upsertUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const update = req.body;

    const user = await User.findOneAndUpdate(
      { userId },
      { $set: { ...update, userId } },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      data: user,
      message: "Profile saved successfully",
    });
  } catch (error) {
    console.error("Upsert user profile error:", error);
    res.status(500).json({ success: false, message: "Failed to save profile" });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const deleted = await User.findOneAndDelete({ userId });
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Delete user profile error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete profile" });
  }
};
