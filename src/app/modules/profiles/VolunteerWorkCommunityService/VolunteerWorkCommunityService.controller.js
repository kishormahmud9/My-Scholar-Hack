import { StatusCodes } from "http-status-codes";
import { VolunteerService } from "./VolunteerWorkcommunityService.service.js";


const getVolunteer = async (req, res, next) => {
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
      await VolunteerService.getByProfileId(
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

const createVolunteer = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.userId;
    const { organization, totalHours } = req.body;

    if (!organization || totalHours === undefined) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Organization and total hours are required",
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
      await VolunteerService.getByProfileId(
        prisma,
        profile.id
      );

    if (existing) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Volunteer record already exists",
      });
    }

    const data =
      await VolunteerService.create(
        prisma,
        profile.id,
        { organization, totalHours: Number(totalHours) }
      );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Volunteer work created successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

const updateVolunteer = async (req, res, next) => {
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
      await VolunteerService.update(
        prisma,
        profile.id,
        data
      );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Volunteer work updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const VolunteerController = {
  getVolunteer,
  createVolunteer,
  updateVolunteer,
};
