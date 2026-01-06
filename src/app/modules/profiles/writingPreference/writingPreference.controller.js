import { WritingPreferenceService } from "./writingPreference.service.js";

const upsertWritingPreference = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId, ...data } = req.body;

        if (!userProfileId) {
            return res.status(400).json({ success: false, message: "userProfileId required" });
        }

        const result = await WritingPreferenceService.upsert(prisma, userProfileId, data);

        return res.json({
            success: true,
            message: "Writing preferences saved successfully",
            data: result,
        });
    } catch (error) {
        console.error("upsertWritingPreference error:", error);
        return res.status(500).json({ success: false, message: "Failed to save writing preferences" });
    }
};

const getWritingPreference = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId } = req.params;

        const result = await WritingPreferenceService.findByProfileId(prisma, userProfileId);

        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("getWritingPreference error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch writing preferences" });
    }
};

export const WritingPreferenceController = {
    upsertWritingPreference,
    getWritingPreference,
};
