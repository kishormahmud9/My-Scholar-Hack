import { ProfileService } from "./profile.service.js";


const upsertUserProfile = async (req, res) => {
  try {
    const prisma = req.prisma;
    const userId = req.user?.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId required" });
    }

    const { userId: _, ...data } = req.body;

    const profile = await ProfileService.upsertByUserId(prisma, userId, data);

    res.json({
      success: true,
      message: "User profile saved successfully",
      data: profile,
    });
  } catch (error) {
    console.error("upsertUserProfile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save user profile",
    });
  }
};

const getProfileMe = async (req, res) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.userId;

    const profile = await ProfileService.findByUserId(prisma, userId);

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("getProfileMe error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const ProfileController = { upsertUserProfile, getProfileMe };
