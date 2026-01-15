import fs from "fs";
import path from "path";
import { ProfileService } from "./profile.service.js";


// const upsertUserProfile = async (req, res) => {
//   try {
//     const prisma = req.prisma;
//     const userId = req.user?.id || req.body.userId;

//     if (!userId) {
//       return res.status(400).json({ success: false, message: "userId required" });
//     }

//     const { userId: _, ...data } = req.body;

//     const profile = await ProfileService.upsertByUserId(prisma, userId, data);

//     res.json({
//       success: true,
//       message: "User profile saved successfully",
//       data: profile,
//     });
//   } catch (error) {
//     console.error("upsertUserProfile error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to save user profile",
//     });
//   }
// };
const upsertUserProfile = async (req, res) => {
  try {
    const prisma = req.prisma;
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId required",
      });
    }

    const { userId: _, ...data } = req.body;

    // 👇 attach uploaded file (if exists)
    if (req.file) {
      data.profilePicture = req.file.filename;
      // OR req.file.path if you prefer full path
    }

    const oldProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (oldProfile?.profilePicture && req.file) {
      fs.unlink(
        path.join("uploads/profile", oldProfile.profilePicture),
        () => { }
      );
    }


    const profile = await ProfileService.upsertByUserId(
      prisma,
      userId,
      data
    );

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
    const userId = req.user.id;

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
