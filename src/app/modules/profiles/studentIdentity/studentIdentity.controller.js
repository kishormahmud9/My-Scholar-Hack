import { StudentIdentityService } from "./studentIdentity.service.js";

const upsertStudentIdentity = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId, ...data } = req.body;

        if (!userProfileId) {
            return res.status(400).json({
                success: false,
                message: "userProfileId is required",
            });
        }

        const result = await StudentIdentityService.upsert(prisma, userProfileId, data);

        return res.json({
            success: true,
            message: "Student identity saved successfully",
            data: result,
        });
    } catch (error) {
        console.error("upsertStudentIdentity error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save student identity",
        });
    }
};

const getStudentIdentity = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId } = req.params;

        const result = await StudentIdentityService.findByProfileId(prisma, userProfileId);

        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("getStudentIdentity error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch student identity",
        });
    }
};

export const StudentIdentityController = {
    upsertStudentIdentity,
    getStudentIdentity,
};
