import { StudentChallengeService } from "./studentChallenge.service.js";

const createChallenge = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId, challengeType, description } = req.body;

        if (!userProfileId) {
            return res.status(400).json({ success: false, message: "userProfileId required" });
        }

        const result = await StudentChallengeService.create(prisma, {
            userProfileId,
            challengeType,
            description,
        });

        return res.json({
            success: true,
            message: "Challenge added successfully",
            data: result,
        });
    } catch (error) {
        console.error("createChallenge error:", error);
        return res.status(500).json({ success: false, message: "Failed to add challenge" });
    }
};

const updateChallenge = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;
        const data = req.body;

        const result = await StudentChallengeService.update(prisma, id, data);

        return res.json({
            success: true,
            message: "Challenge updated successfully",
            data: result,
        });
    } catch (error) {
        console.error("updateChallenge error:", error);
        return res.status(500).json({ success: false, message: "Failed to update challenge" });
    }
};

const deleteChallenge = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;

        await StudentChallengeService.delete(prisma, id);

        return res.json({
            success: true,
            message: "Challenge deleted successfully",
        });
    } catch (error) {
        console.error("deleteChallenge error:", error);
        return res.status(500).json({ success: false, message: "Failed to delete challenge" });
    }
};

const getChallenges = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId } = req.params;

        const result = await StudentChallengeService.findAllByProfileId(prisma, userProfileId);

        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("getChallenges error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch challenges" });
    }
};

export const StudentChallengeController = {
    createChallenge,
    updateChallenge,
    deleteChallenge,
    getChallenges,
};
