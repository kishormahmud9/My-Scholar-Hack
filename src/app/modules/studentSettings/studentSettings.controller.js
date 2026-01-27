import { StudentSettingsService } from "./studentSettings.service.js";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse.js";

const upsertStudentSettings = async (req, res, next) => {
    try {
        const prisma = req.prisma;
        const userId = req.user.id;
        const data = req.body;

        const result = await StudentSettingsService.upsertStudentSettings(
            prisma,
            userId,
            data
        );

        sendResponse(res, {
            success: true,
            message: "Student settings updated successfully",
            statusCode: StatusCodes.OK,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getStudentSettings = async (req, res, next) => {
    try {
        const prisma = req.prisma;
        const userId = req.user.id;

        const result = await StudentSettingsService.getStudentSettingsByUserId(
            prisma,
            userId
        );

        sendResponse(res, {
            success: true,
            message: "Student settings fetched successfully",
            statusCode: StatusCodes.OK,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const StudentSettingsController = {
    upsertStudentSettings,
    getStudentSettings,
};
