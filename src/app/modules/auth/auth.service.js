import { envVars } from "../../config/env.js";
import { sendEmail } from "../../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import DevBuildError from "../../lib/DevBuildError.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import prisma from "../../prisma/client.js";

export const AuthService = {

  findByEmail: async (prisma, email) =>
    prisma.user.findUnique({ where: { email } }),
  findByUsername: async (prisma, username) =>
    prisma.user.findUnique({ where: { username } }),
  findById: async (prisma, id) => prisma.user.findUnique({ where: { id } }),

  resetPassword: async (payload, decodedToken) => {
    const { id, newPassword } = payload;
    const { userId } = decodedToken;

    // 1️⃣ Validate user identity
    if (id !== userId) {
      throw new DevBuildError("Invalid user", StatusCodes.FORBIDDEN);
    }

    // 2️⃣ Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new DevBuildError("User does not exist", StatusCodes.FORBIDDEN);
    }

    // 3️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      Number(envVars.BCRYPT_SALT_ROUND || 10)
    );

    // 4️⃣ Update password
    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: hashedPassword,
      },
    });

    return true;
  },
};

export const forgotPasswordService = async (prisma, email) => {
  // 1️⃣ Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new DevBuildError("User not found", StatusCodes.FORBIDDEN);
  }

  // 2️⃣ Verification & status checks
  if (!user.isVerified) {
    throw new DevBuildError("User is not verified", StatusCodes.BAD_REQUEST);
  }

  if (user.status === "BLOCKED" || user.status === "INACTIVE") {
    throw new DevBuildError(`User is ${user.status}`, StatusCodes.BAD_REQUEST);
  }

  if (user.isDeleted) {
    throw new DevBuildError("User is deleted", StatusCodes.BAD_REQUEST);
  }

  // 3️⃣ Create JWT reset token (short-lived)
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const resetToken = jwt.sign(
    jwtPayload,
    envVars.JWT_SECRET_TOKEN, // access secret is fine for reset
    {
      expiresIn: "10m",
    }
  );

  // 4️⃣ Build reset URL
  const resetUILink = `${envVars.FRONT_END_URL}/reset-password?id=${user.id}&token=${resetToken}`;

  // 5️⃣ Send reset email
  await sendEmail({
    to: user.email,
    subject: "Forgot Password - Reset Your Password",
    templateName: "forgotPassword",
    templateData: {
      name: user.name || "Student",
      resetUILink,
    },
  });

  return true;
};
