import { FamilyBackgroundService } from "./familyBackground.service.js";

const upsertFamilyBackground = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId, ...data } = req.body;

        if (!userProfileId) {
            return res.status(400).json({
                success: false,
                message: "userProfileId is required",
            });
        }

        const result = await FamilyBackgroundService.upsert(prisma, userProfileId, data);

        return res.json({
            success: true,
            message: "Family background saved successfully",
            data: result,
        });
    } catch (error) {
        console.error("upsertFamilyBackground error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to save family background",
        });
    }
};

const getFamilyBackground = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { userProfileId } = req.params;

        const result = await FamilyBackgroundService.findByProfileId(prisma, userProfileId);

        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("getFamilyBackground error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch family background",
        });
    }
};

export const FamilyBackgroundController = {
    upsertFamilyBackground,
    getFamilyBackground,
};
