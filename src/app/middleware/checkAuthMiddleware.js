import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import prisma from "../prisma/client.js";
import { envVars } from "../config/env.js";
import DevBuildError from "../lib/DevBuildError.js";

export const checkAuthMiddleware =
  (...allowedRoles) =>
    async (req, res, next) => {
      console.log("🔥 Auth middleware hit:", req.originalUrl);

      try {
        const token = req.headers.authorization;

        if (!token) {
          throw new DevBuildError("No token provided", StatusCodes.UNAUTHORIZED);
        }

        const jwtToken = token.replace(/^Bearer\s*/i, "");
        const decoded = jwt.verify(jwtToken, envVars.JWT_SECRET_TOKEN);

        // Fetch user and profile from database
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId || decoded.id },
          include: {
            profile: true,
          },
        });

        if (!user) {
          throw new DevBuildError("User does not exist", StatusCodes.UNAUTHORIZED);
        }

        if (!user.isVerified) {
          throw new DevBuildError("User is not verified", StatusCodes.UNAUTHORIZED);
        }

        if (user.status === "BLOCKED" || user.status === "INACTIVE") {
          throw new DevBuildError(`User is ${user.status.toLowerCase()}`, StatusCodes.FORBIDDEN);
        }

        if (user.isDeleted) {
          throw new DevBuildError("User has been deleted", StatusCodes.GONE);
        }

        // Role check (if roles provided)
        if (allowedRoles.length && !allowedRoles.includes(user.role)) {
          throw new DevBuildError(
            "You are not permitted to access this resource",
            StatusCodes.FORBIDDEN
          );
        }

        // Attach user info to request
        req.user = {
          userId: user.id,
          userProfileId: user.profile?.id,
          email: user.email,
          role: user.role,
        };

        // Lazy create profile for students if missing (if business logic requires it here)
        if (!req.user.userProfileId && user.role === "STUDENT") {
          const newProfile = await prisma.userProfile.create({
            data: {
              userId: user.id,
              fullName: user.name || "Student",
            },
          });
          req.user.userProfileId = newProfile.id;
        }

        next();
      } catch (error) {
        console.error("🔐 Auth Middleware Error:", error.message);

        if (error.name === "TokenExpiredError") {
          return next(new DevBuildError("Token expired", StatusCodes.UNAUTHORIZED));
        }

        if (error.name === "JsonWebTokenError") {
          return next(new DevBuildError("Invalid token", StatusCodes.UNAUTHORIZED));
        }

        next(error);
      }
    };
