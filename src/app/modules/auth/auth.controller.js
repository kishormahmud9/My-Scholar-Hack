import DevBuildError from "../../lib/DevBuildError.js";
import { UserService } from "../user/user.service.js";


// ✅ Login User
 const loginUser = async (req, res, next) => {
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
 const refreshToken = async (req, res, next) => {
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
        const user = await UserService.findById(prisma, decoded.id);
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
export const AuthController = { loginUser, refreshToken };