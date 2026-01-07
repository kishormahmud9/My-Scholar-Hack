import { StudentWorkService } from "./studentWork.service.js";

const createWork = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId, jobTitle, employer, isCurrent } = req.body;

        if (!userProfileId) {
            return res.status(400).json({ success: false, message: "userProfileId required" });
        }

        const result = await StudentWorkService.create(prisma, {
            userProfileId,
            jobTitle,
            employer,
            isCurrent,
        });

        return res.json({
            success: true,
            message: "Work experience added successfully",
            data: result,
        });
    } catch (error) {
        console.error("createWork error:", error);
        return res.status(500).json({ success: false, message: "Failed to add work experience" });
    }
};

const updateWork = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;
        const data = req.body;

        const result = await StudentWorkService.update(prisma, id, data);

        return res.json({
            success: true,
            message: "Work experience updated successfully",
            data: result,
        });
    } catch (error) {
        console.error("updateWork error:", error);
        return res.status(500).json({ success: false, message: "Failed to update work experience" });
    }
};

const deleteWork = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;

        await StudentWorkService.delete(prisma, id);

        return res.json({
            success: true,
            message: "Work experience deleted successfully",
        });
    } catch (error) {
        console.error("deleteWork error:", error);
        return res.status(500).json({ success: false, message: "Failed to delete work experience" });
    }
};

const getWorkExperiences = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId } = req.params;

        const result = await StudentWorkService.findAllByProfileId(prisma, userProfileId);

        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("getWorkExperiences error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch work experiences" });
    }
};

export const StudentWorkController = {
    createWork,
    updateWork,
    deleteWork,
    getWorkExperiences,
};
