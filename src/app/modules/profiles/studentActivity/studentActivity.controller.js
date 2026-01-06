import { StudentActivityService } from "./studentActivity.service.js";

const createActivity = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId, activityName, role, impact } = req.body;

        if (!userProfileId) {
            return res.status(400).json({ success: false, message: "userProfileId required" });
        }

        const result = await StudentActivityService.create(prisma, {
            userProfileId,
            activityName,
            role,
            impact,
        });

        return res.json({
            success: true,
            message: "Activity added successfully",
            data: result,
        });
    } catch (error) {
        console.error("createActivity error:", error);
        return res.status(500).json({ success: false, message: "Failed to add activity" });
    }
};

const updateActivity = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;
        const data = req.body;

        const result = await StudentActivityService.update(prisma, id, data);

        return res.json({
            success: true,
            message: "Activity updated successfully",
            data: result,
        });
    } catch (error) {
        console.error("updateActivity error:", error);
        return res.status(500).json({ success: false, message: "Failed to update activity" });
    }
};

const deleteActivity = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;

        await StudentActivityService.delete(prisma, id);

        return res.json({
            success: true,
            message: "Activity deleted successfully",
        });
    } catch (error) {
        console.error("deleteActivity error:", error);
        return res.status(500).json({ success: false, message: "Failed to delete activity" });
    }
};

const getActivities = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId } = req.params;

        const result = await StudentActivityService.findAllByProfileId(prisma, userProfileId);

        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("getActivities error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch activities" });
    }
};

export const StudentActivityController = {
    createActivity,
    updateActivity,
    deleteActivity,
    getActivities,
};
