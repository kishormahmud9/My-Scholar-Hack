import { EducationService } from "./education.service.js";

const createEducation = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId, institutionName, level, startYear, endYear } = req.body;

        if (!userProfileId) {
            return res.status(400).json({ success: false, message: "userProfileId required" });
        }

        const result = await EducationService.create(prisma, {
            userProfileId,
            institutionName,
            level,
            startYear,
            endYear,
        });

        return res.json({
            success: true,
            message: "Education added successfully",
            data: result,
        });
    } catch (error) {
        console.error("createEducation error:", error);
        return res.status(500).json({ success: false, message: "Failed to add education" });
    }
};

const updateEducation = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;
        const data = req.body;

        const result = await EducationService.update(prisma, id, data);

        return res.json({
            success: true,
            message: "Education updated successfully",
            data: result,
        });
    } catch (error) {
        console.error("updateEducation error:", error);
        return res.status(500).json({ success: false, message: "Failed to update education" });
    }
};

const deleteEducation = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;

        await EducationService.delete(prisma, id);

        return res.json({
            success: true,
            message: "Education deleted successfully",
        });
    } catch (error) {
        console.error("deleteEducation error:", error);
        return res.status(500).json({ success: false, message: "Failed to delete education" });
    }
};

const getEducations = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId } = req.params;

        const result = await EducationService.findAllByProfileId(prisma, userProfileId);

        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("getEducations error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch education" });
    }
};

export const EducationController = {
    createEducation,
    updateEducation,
    deleteEducation,
    getEducations,
};
