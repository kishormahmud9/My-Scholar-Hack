import { AcademicInterestService } from "./academicInterest.service.js";

const upsertAcademicInterest = async (req, res) => {
    try {
        const prisma = req.prisma;
        const userProfileId = req.user?.userProfileId || req.body.userProfileId;
        const { userProfileId: _, ...data } = req.body;

        if (!userProfileId) {
            return res.status(400).json({
                success: false,
                message: "userProfileId is required",
            });
        }

        const result = await AcademicInterestService.upsert(prisma, userProfileId, data);

        return res.json({
            success: true,
            message: "Academic interest saved successfully",
            data: result,
        });
    } catch (error) {
        console.error("upsertAcademicInterest error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save academic interest",
        });
    }
};

const getAcademicInterest = async (req, res) => {
    try {
        const prisma = req.prisma;
        const userProfileId = req.params.userProfileId || req.user?.userProfileId;

        const result = await AcademicInterestService.findByProfileId(prisma, userProfileId);

        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("getAcademicInterest error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch academic interest",
        });
    }
};

export const AcademicInterestController = {
    upsertAcademicInterest,
    getAcademicInterest,
};
