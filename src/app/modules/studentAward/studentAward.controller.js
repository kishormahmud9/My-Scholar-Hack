import { StudentAwardService } from "./studentAward.service.js";

const createAward = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId, awardName, reason } = req.body;

        if (!userProfileId) {
            return res.status(400).json({ success: false, message: "userProfileId required" });
        }

        const result = await StudentAwardService.create(prisma, {
            userProfileId,
            awardName,
            reason,
        });

        return res.json({
            success: true,
            message: "Award added successfully",
            data: result,
        });
    } catch (error) {
        console.error("createAward error:", error);
        return res.status(500).json({ success: false, message: "Failed to add award" });
    }
};

const updateAward = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;
        const data = req.body;

        const result = await StudentAwardService.update(prisma, id, data);

        return res.json({
            success: true,
            message: "Award updated successfully",
            data: result,
        });
    } catch (error) {
        console.error("updateAward error:", error);
        return res.status(500).json({ success: false, message: "Failed to update award" });
    }
};

const deleteAward = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;

        await StudentAwardService.delete(prisma, id);

        return res.json({
            success: true,
            message: "Award deleted successfully",
        });
    } catch (error) {
        console.error("deleteAward error:", error);
        return res.status(500).json({ success: false, message: "Failed to delete award" });
    }
};

const getAwards = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId } = req.params;

        const result = await StudentAwardService.findAllByProfileId(prisma, userProfileId);

        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("getAwards error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch awards" });
    }
};

export const StudentAwardController = {
    createAward,
    updateAward,
    deleteAward,
    getAwards,
};
