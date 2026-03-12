import { StatusCodes } from "http-status-codes";
import { ManualApplicationService } from "./manualApplication.service.js";

const createManualApplication = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.id;
    const data = { ...req.body, userId };

    const result = await ManualApplicationService.create(prisma, data);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Manual application created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllManualApplications = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const result = await ManualApplicationService.getAll(prisma, req.query);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Manual applications fetched successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const getManualApplicationById = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const { id } = req.params;

    const result = await ManualApplicationService.getById(prisma, id);

    if (!result) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Manual application not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Manual application fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateManualApplication = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const { id } = req.params;
    const data = req.body;

    const result = await ManualApplicationService.update(prisma, id, data);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Manual application updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteManualApplication = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const { id } = req.params;

    await ManualApplicationService.remove(prisma, id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Manual application deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const ManualApplicationController = {
  createManualApplication,
  getAllManualApplications,
  getManualApplicationById,
  updateManualApplication,
  deleteManualApplication,
};
