import { UniqueExperienceService } from "./uniqueExperience.service.js";

const upsertUniqueExperience = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId, ...data } = req.body;

        if (!userProfileId) {
            return res.status(400).json({ success: false, message: "userProfileId required" });
        }

        const result = await UniqueExperienceService.upsert(prisma, userProfileId, data);

        return res.json({
            success: true,
            message: "Unique experiences saved successfully",
            data: result,
        });
    } catch (error) {
        console.error("upsertUniqueExperience error:", error);
        return res.status(500).json({ success: false, message: "Failed to save unique experiences" });
    }
};

const getUniqueExperience = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId } = req.params;

        const result = await UniqueExperienceService.findByProfileId(prisma, userProfileId);

        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("getUniqueExperience error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch unique experiences" });
    }
};

export const UniqueExperienceController = {
    upsertUniqueExperience,
    getUniqueExperience,
};
