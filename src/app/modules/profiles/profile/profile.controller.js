import fs from "fs";
import path from "path";
import { ProfileService } from "./profile.service.js";



// const upsertUserProfile = async (req, res) => {
//   try {
//     const prisma = req.prisma;
//     const userId = req.user?.id || req.body.userId;

//     if (!userId) {
//       return res.status(400).json({
//         success: false,
//         message: "userId required",
//       });
//     }

//     const { userId: _, ...data } = req.body;
//     const user = req.user;

//     // 📸 handle uploaded file
//     if (req.file) {
//       data.profilePicture = req.file.filename;
//       data.filePath = req.file.path;
//     }

//     const oldProfile = await prisma.userProfile.findUnique({
//       where: { userId },
//     });

//     // 👤 required fullName only on first create
//     if (!data.fullName && !oldProfile) {
//       data.fullName = user.name || "User";
//     }

//     // 🧹 remove undefined fields
//     Object.keys(data).forEach((key) => {
//       if (data[key] === undefined) delete data[key];
//     });

//     const profile = await ProfileService.upsertByUserId(
//       prisma,
//       userId,
//       data
//     );

//     // 🗑️ delete old file AFTER successful upsert
//     if (oldProfile?.filePath && req.file) {
//       fs.unlink(oldProfile.filePath, () => {});
//     }

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
    const user = req.user;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId required",
      });
    }

    const { userId: _, ...data } = req.body;

    // 📸 Handle uploaded file
    if (req.file) {
      data.profilePicture = req.file.filename;

      // ✅ OS-safe, DB-safe path (ALWAYS use /)
      data.filePath = `uploads/profile/${req.file.filename}`;
    }

    // 🔍 Check existing profile
    const oldProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    // 👤 fullName is REQUIRED in schema → only set on CREATE
    if (!oldProfile && !data.fullName) {
      data.fullName = user?.name || "User";
    }

    // 🧹 Remove undefined fields (VERY IMPORTANT)
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined) {
        delete data[key];
      }
    });

    // 🔢 Parse numerical fields
    if (data.gpa) {
      data.gpa = parseFloat(data.gpa);
    }

    // 💾 UPSERT
    const profile = await ProfileService.upsertByUserId(
      prisma,
      userId,
      data
    );

    // 🗑️ Delete old file AFTER successful DB save
    if (oldProfile?.filePath && req.file) {
      const oldFileAbsolutePath = path.resolve(oldProfile.filePath);
      fs.unlink(oldFileAbsolutePath, () => { });
    }

    return res.json({
      success: true,
      message: "User profile saved successfully",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

export default upsertUserProfile;


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
    next(error);
  }
};

export const ProfileController = { upsertUserProfile, getProfileMe };
