import * as EducationService from "./education.service.js";
import { StatusCodes } from "http-status-codes";

const createEducation = async (req, res, next) => {
  try {
    const { userProfileId } = req.user;

    const education = await EducationService.createEducation(
      userProfileId,
      req.body
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: education,
    });
  } catch (error) {
    next(error);
  }
};

const getMyEducations = async (req, res, next) => {
  try {
    const { userProfileId } = req.user;

    const educations =
      await EducationService.getEducationsByProfile(userProfileId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: educations,
    });
  } catch (error) {
    next(error);
  }
};

const deleteEducation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userProfileId } = req.user;

    await EducationService.deleteEducation(id, userProfileId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const EducationController = {
  createEducation,
  getMyEducations,
  deleteEducation,
};
