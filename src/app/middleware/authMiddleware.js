// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import { envVars } from "../config/env.js";

// dotenv.config();

// // ✅ Authentication Middleware
// export const authenticateUser = (req, res, next) => {
//     let token = req.header("Authorization");

//     // Fallback to cookie if Authorization header is missing
//     if (!token && req.cookies?.accessToken) {
//         token = `Bearer ${req.cookies.accessToken}`;
//     }

//     if (!token) {
//         return res.status(401).json({ message: "Access denied. No token provided." });
//     }

//     try {
//         // Safe token extraction (handles "Bearer <token>", "Bearer<token>", or just "<token>")
//         const jwtToken = token.replace(/^Bearer\s*/i, "");

//         const decoded = jwt.verify(jwtToken, envVars.JWT_SECRET_TOKEN);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         console.error("🔑 JWT Verification Error:", error.message);
//         res.status(401).json({ message: "Invalid or expired token" });
//     }
// };

// // ✅ Admin Middleware
// export const authenticateAdmin = (req, res, next) => {
//     authenticateUser(req, res, () => {
//         if (req.user.role !== "admin") {
//             return res.status(403).json({ message: "Access denied. Admins only." });
//         }
//         next();
//     });
// };



import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import DevBuildError from "../lib/DevBuildError.js";
import { envVars } from "../config/env.js";
import prisma from "../prisma/client.js";


/**
 * Role-based Auth Middleware (Prisma)
 * Usage: checkAuth("STUDENT"), checkAuth("ADMIN")
 */
export const checkAuth =
  (...allowedRoles) =>
    async (req, res, next) => {
      try {
        let token = req.headers.authorization;

        // Fallback to cookie
        if (!token && req.cookies?.accessToken) {
          token = `Bearer ${req.cookies.accessToken}`;
        }

        if (!token) {
          throw new DevBuildError(
            "Access denied. No token provided.",
            StatusCodes.UNAUTHORIZED
          );
        }

        // Extract JWT safely
        const jwtToken = token.replace(/^Bearer\s*/i, "");

        // Verify token
        const decoded = jwt.verify(jwtToken, envVars.JWT_SECRET_TOKEN);

        // Fetch user from DB with profile
        const userId = decoded.id || decoded.userId;
        const user = await prisma.user.findUnique({
          where: { id: userId },
          include: { profile: true },
        });

        if (!user) {
          throw new DevBuildError(
            "User does not exist",
            StatusCodes.BAD_REQUEST
          );
        }

        // Lazy create profile for students if missing
        let profileId = user.profile?.id;
        if (!profileId && user.role === "STUDENT") {
          const newProfile = await prisma.userProfile.create({
            data: {
              userId: user.id,
              fullName: user.name || "Student",
            },
          });
          profileId = newProfile.id;
        }

        if (!user.isVerified) {
          throw new DevBuildError(
            "User is not verified",
            StatusCodes.BAD_REQUEST
          );
        }

        if (user.status === "BLOCKED" || user.status === "INACTIVE") {
          throw new DevBuildError(
            `User is ${user.status}`,
            StatusCodes.BAD_REQUEST
          );
        }

        if (user.isDeleted) {
          throw new DevBuildError(
            "User is deleted",
            StatusCodes.BAD_REQUEST
          );
        }

        // Role check (if roles provided)
        if (
          allowedRoles.length &&
          !allowedRoles.includes(user.role)
        ) {
          throw new DevBuildError(
            "You are not permitted to access this resource",
            StatusCodes.FORBIDDEN
          );
        }

        // Attach user info to request
        req.user = {
          userId: user.id,
          userProfileId: profileId,
          email: user.email,
          role: user.role,
        };

        next();
      } catch (error) {
        console.error("🔐 Auth Middleware Error:", error.message);
        next(error);
      }
    };

