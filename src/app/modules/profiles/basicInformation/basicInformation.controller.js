import { StatusCodes } from "http-status-codes";
import { BasicInformationService } from "./basicInformation.service.js";

export const BasicInformationController = {
  // ✅ POST /basic-information
  create: async (req, res, next) => {
    try {
      const prisma = req.prisma;
      const userProfileId = req.user.userProfileId || req.body.userProfileId;

      if (!userProfileId) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "userProfileId is required",
        });
      }

      const data = req.body;

      const result =
        await BasicInformationService.create(
          prisma,
          userProfileId,
          data
        );

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Basic information created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // ✅ GET /basic-information/me
  getMe: async (req, res, next) => {
    try {
      const prisma = req.prisma;
      const userProfileId = req.user.userProfileId;

      const result =
        await BasicInformationService.getByUserProfileId(
          prisma,
          userProfileId
        );

      res.status(StatusCodes.OK).json({
        success: true,
        data: result,
        message: "Basic information fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  // ✅ PUT /basic-information
  update: async (req, res, next) => {
    try {
      const prisma = req.prisma;
      const userProfileId = req.user.userProfileId;

      const data = req.body;

      const result =
        await BasicInformationService.updateByUserProfileId(
          prisma,
          userProfileId,
          data
        );

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Basic information updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // ✅ POST /basic-information/upsert (BEST OPTION)
  upsert: async (req, res, next) => {
    try {
      const prisma = req.prisma;
      const userProfileId = req.user.userProfileId;

      if (!userProfileId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          success: false,
          message: "Profile not found for this user",
        });
      }

      const { userProfileId: _, ...data } = req.body;

      const result =
        await BasicInformationService.upsertByUserProfileId(
          prisma,
          userProfileId,
          data
        );

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Basic information saved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
