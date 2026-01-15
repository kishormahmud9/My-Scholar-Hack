import { EssayService } from "./essay.service.js";

const upsertSpecificQuestions = async (req, res) => {
    try {
        const prisma = req.prisma;
        const userProfileId = req.user?.userProfileId || req.body.userProfileId;
        const { userProfileId: _, ...data } = req.body;

        if (!userProfileId) {
            return res.status(400).json({ success: false, message: "userProfileId required" });
        }

        const result = await EssayService.upsertSpecificQuestions(prisma, userProfileId, data);

        return res.json({
            success: true,
            message: "Essay specific questions saved successfully",
            data: result,
        });
    } catch (error) {
        console.error("upsertSpecificQuestions error:", error);
        return res.status(500).json({ success: false, message: "Failed to save essay specific questions" });
    }
};

const getSpecificQuestions = async (req, res) => {
    try {
        const prisma = req.prisma;
        const userProfileId = req.params.userProfileId || req.user?.userProfileId;

        const result = await EssayService.findSpecificQuestionsByProfileId(prisma, userProfileId);

        return res.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("getSpecificQuestions error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch essay specific questions" });
    }
};

const createEssay = async (req, res) => {
    try {
        const prisma = req.prisma;
        const userId = req.user.id;
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
    upsertSpecificQuestions,
    getSpecificQuestions,
    createEssay,
    updateEssay,
    deleteEssay,
    getEssays,
};
