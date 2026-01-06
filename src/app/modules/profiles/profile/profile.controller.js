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

    let profile = await ProfileService.findByUserId(prisma, userId);

    // ✅ If profile doesn't exist, create a basic one instead of returning 404
    if (!profile) {
      // Fetch user to get potential default data like name
      const user = await prisma.user.findUnique({ where: { id: userId } });

      profile = await ProfileService.create(prisma, {
        userId,
        fullName: user?.name || "Student",
        // Add other mandatory fields with defaults if necessary
      });

      // Fetch again to include all relations defined in findByUserId
      profile = await ProfileService.findByUserId(prisma, userId);
    }

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
