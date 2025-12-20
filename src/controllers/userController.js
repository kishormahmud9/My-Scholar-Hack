import { UserModel } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateTokens } from "../lib/generateToken.js";
import DevBuildError from "../lib/DevBuildError.js";

// ✅ User Registration
export const registerUser = async (req, res, next) => {
  try {
    const prisma = req.app.get("prisma");
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findByEmail(prisma, email);
    if (existingUser) throw new DevBuildError("Email already exists", 400);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Run everything in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Create User
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash: hashedPassword,
          // status: "active",
          // role: "student",
        },
      });

      return user;
    });

    res
      .status(201)
      .json({ message: "User registered successfully", user: result });
  } catch (error) {
    next(error);
  }
};

// ✅ Login User
export const loginUser = async (req, res, next) => {
  try {
    const prisma = req.app.get("prisma");
    const { email, password } = req.body;
    console.log("📌 Login Request:", email);

    // ✅ Fetch user from MySQL
    const user = await UserModel.findByEmail(prisma, email);
    if (!user) throw new DevBuildError("User not found", 400);

    // ✅ Password Matching
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new DevBuildError("Invalid credentials", 400);
    }

    // ✅ Generate Tokens
    const { accessToken, refreshToken } = generateTokens(user);

    res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

// ✅ Refresh Token
export const refreshToken = async (req, res, next) => {
  try {
    const prisma = req.app.get("prisma"); // ✅ Fixed (was db before)
    const { refreshToken } = req.body;

    if (!refreshToken) throw new DevBuildError("Refresh token required", 401);

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN,
      async (err, decoded) => {
        if (err) throw new DevBuildError("Invalid refresh token", 403);

        // ✅ Check if user still exists
        const user = await UserModel.findById(prisma, decoded.id);
        if (!user) throw new DevBuildError("User not found", 400);

        // ✅ Issue new access token
        const newAccessToken = jwt.sign(
          { id: user.id, role: user.role },
          process.env.JWT_SECRET_TOKEN,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    next(error);
  }
};

// User details by ID
export const userDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prisma = req.prisma; // already injected middleware দিয়ে

    const user = await UserModel.findByIdWithProfile(prisma, id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
