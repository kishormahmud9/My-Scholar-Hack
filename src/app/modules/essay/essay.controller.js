import { EssayService } from "./essay.service.js";

const upsertNarrative = async (req, res) => {
    try {
        const prisma = req.prisma;
        const userProfileId = req.user?.userProfileId || req.body.userProfileId;
        const { userProfileId: _, ...data } = req.body;

        if (!userProfileId) {
            return res.status(400).json({ success: false, message: "userProfileId required" });
        }

        const result = await EssayService.upsertNarrative(prisma, userProfileId, data);

        return res.json({
            success: true,
            message: "Essay narrative saved successfully",
            data: result,
        });
    } catch (error) {
        console.error("upsertNarrative error:", error);
        return res.status(500).json({ success: false, message: "Failed to save essay narrative" });
    }
};

const getNarrative = async (req, res) => {
    try {
        const prisma = req.prisma;
        const userProfileId = req.params.userProfileId || req.user?.userProfileId;

        const result = await EssayService.findNarrativeByProfileId(prisma, userProfileId);

        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("getNarrative error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch essay narrative" });
    }
};

const createEssay = async (req, res) => {
    try {
        const prisma = req.prisma;
        const userId = req.user.userId;
        const userProfileId = req.user.userProfileId || req.body.userProfileId;
        const { title, prompt, contentDraft } = req.body;

        const result = await EssayService.createEssay(prisma, {
            userId,
            userProfileId,
            title,
            prompt,
            contentDraft,
            status: "draft",
        });

        return res.json({
            success: true,
            message: "Essay created successfully",
            data: result,
        });
    } catch (error) {
        console.error("createEssay error:", error);
        return res.status(500).json({ success: false, message: "Failed to create essay" });
    }
};

const updateEssay = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;
        const data = req.body;

        const result = await EssayService.updateEssay(prisma, id, data);

        return res.json({
            success: true,
            message: "Essay updated successfully",
            data: result,
        });
    } catch (error) {
        console.error("updateEssay error:", error);
        return res.status(500).json({ success: false, message: "Failed to update essay" });
    }
};

const deleteEssay = async (req, res) => {
    try {
        const prisma = req.prisma;
        const { id } = req.params;

        await EssayService.deleteEssay(prisma, id);

        return res.json({
            success: true,
            message: "Essay deleted successfully",
        });
    } catch (error) {
        console.error("deleteEssay error:", error);
        return res.status(500).json({ success: false, message: "Failed to delete essay" });
    }
};

const getEssays = async (req, res) => {
    try {
        const prisma = req.prisma;
        const userProfileId = req.params.userProfileId || req.user?.userProfileId;

        const result = await EssayService.findAllEssaysByProfileId(prisma, userProfileId);

        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("getEssays error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch essays" });
    }
};

export const EssayController = {
    upsertNarrative,
    getNarrative,
    createEssay,
    updateEssay,
    deleteEssay,
    getEssays,
};
