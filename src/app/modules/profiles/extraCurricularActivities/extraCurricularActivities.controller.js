import { StatusCodes } from "http-status-codes";
import { ExtracurricularActivityService } from "./extraCurricularActivities.service.js";

const getExtracurricularActivity = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.userId;

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User profile not found",
      });
    }

    const data =
      await ExtracurricularActivityService.getByUserProfileId(
        prisma,
        profile.id
      );

    res.status(StatusCodes.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const createExtracurricularActivity = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.userId;
    const { activityName, yearsInvolved, leadership } = req.body;

    if (!activityName || !yearsInvolved) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Activity name and years involved are required",
      });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User profile not found",
      });
    }

    const existing =
      await ExtracurricularActivityService.getByUserProfileId(
        prisma,
        profile.id
      );

    if (existing) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message:
          "Extracurricular activity already exists. Use update instead.",
      });
    }

    const data =
      await ExtracurricularActivityService.create(
        prisma,
        profile.id,
        { activityName, yearsInvolved, leadership }
      );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Extracurricular activity added successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateExtracurricularActivity = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.userId;
    const data = req.body;

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User profile not found",
      });
    }

    const result =
      await ExtracurricularActivityService.update(
        prisma,
        profile.id,
        data
      );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Extracurricular activity updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const ExtracurricularActivityController = {
  getExtracurricularActivity,
  createExtracurricularActivity,
  updateExtracurricularActivity,
};
