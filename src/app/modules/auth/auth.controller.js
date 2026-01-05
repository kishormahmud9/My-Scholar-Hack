import DevBuildError from "../../lib/DevBuildError.js";
import { AuthService } from "./auth.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateTokens } from "../../utils/generateToken.js";
import { envVars } from "../../config/env.js";


// ✅ Login User
const loginUser = async (req, res, next) => {
  try {
    const prisma = req.app.get("prisma");
    const { email, password } = req.body;
    console.log("📌 Login Request:", email);

    if (!password) throw new DevBuildError("Password required", 400);

    // ✅ Fetch user from DB
    const user = await AuthService.findByEmail(prisma, email);
    if (!user) throw new DevBuildError("User not found", 400);

    // ✅ Password Matching (use stored passwordHash)
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new DevBuildError("Invalid credentials", 400);
    }

    // ✅ Check if user is verified
    if (!user.isVerified) {
      throw new DevBuildError("User is not verified. Please verify your email.", 403);
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
const refreshToken = async (req, res, next) => {
  try {
    const prisma = req.app.get("prisma"); // ✅ Fixed (was db before)
    const { refreshToken } = req.body;

    if (!refreshToken) throw new DevBuildError("Refresh token required", 401);

    jwt.verify(
      refreshToken,
      envVars.JWT_REFRESH_TOKEN,
      async (err, decoded) => {
        if (err) throw new DevBuildError("Invalid refresh token", 403);

        // ✅ Check if user still exists
        const user = await AuthService.findById(prisma, decoded.id);
        if (!user) throw new DevBuildError("User not found", 400);

        if (user.isVerified === false) {
          throw new DevBuildError("User is not verified. Please verify your email.", 403);
        }

        // ✅ Issue new access token
        const newAccessToken = jwt.sign(
          { id: user.id, role: user.role },
          envVars.JWT_SECRET_TOKEN,
          { expiresIn: envVars.JWT_EXPIRES_IN }
        );

        res.status(200).json({ accessToken: newAccessToken });
      }
    );
  } catch (error) {
    next(error);
  }
};
export const AuthController = { loginUser, refreshToken };