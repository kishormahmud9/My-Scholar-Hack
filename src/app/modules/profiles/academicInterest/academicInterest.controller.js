import { StatusCodes } from "http-status-codes";
import { AcademicInterestService } from "./academicInterest.service.js";

const getAcademicInterest = async (req, res, next) => {
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

    const result =
      await AcademicInterestService.getByUserProfileId(
        prisma,
        profile.id
      );

    res.status(StatusCodes.OK).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createAcademicInterest = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.userId;
    const { intendedMajor, whyThisField, careerGoals } = req.body;

    if (!intendedMajor || !whyThisField || !careerGoals) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "All fields are required",
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
      await AcademicInterestService.getByUserProfileId(
        prisma,
        profile.id
      );

    if (existing) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message:
          "Academic interest already exists. Use update instead.",
      });
    }

    const result =
      await AcademicInterestService.create(
        prisma,
        profile.id,
        {
          intendedMajor,
          whyThisField,
          careerGoals,
        }
      );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Academic interest created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateAcademicInterest = async (req, res, next) => {
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
      await AcademicInterestService.update(
        prisma,
        profile.id,
        data
      );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Academic interest updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


export const AcademicInterestController = {
  getAcademicInterest,
  createAcademicInterest,
  updateAcademicInterest,
};
