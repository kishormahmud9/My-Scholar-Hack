import { StatusCodes } from "http-status-codes";
import { EssayService } from "./generateEssay.service.js";
import { normalizeEssayText } from "../../utils/normalizeEssayText.js";
import { toHtml } from "../../utils/toHtml.js";

// =========================
// GET all essays
// =========================
const getEssays = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.userId;

    const data = await EssayService.getByUserId(prisma, userId);

    res.status(StatusCodes.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GET single essay
// =========================
const getEssayById = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.userId;
    const { id } = req.params;

    const data = await EssayService.getById(prisma, id, userId);

    if (!data) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Essay not found",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// CREATE + AI GENERATE
// =========================
const createEssay = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.userId;
    const profileId = req.user.userProfileId;
    const scholarshipId = req.user.scholarshipId;
    const { title, prompt } = req.body;

    if (!prompt) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Prompt is required",
      });
    }

    // 1️⃣ Save prompt
    const essay = await EssayService.createPrompt(prisma, {
      userId,
      title,
      prompt,
      userProfileId: profileId,
      scholarshipId,
    });

    try {
      // 2️⃣ Call AI
      const aiResponse = await EssayService.generateEssayByAI(title, prompt);

      if (!aiResponse?.essay) {
        throw new Error("AI returned empty essay");
      }

      // 3️⃣ Normalize escaped text
      const cleanedContent = normalizeEssayText(aiResponse.essay);

      // 4️⃣ Save CLEAN TEXT ONLY
      const updatedEssay = await EssayService.updateEssay(prisma, essay.id, {
        contentFinal: cleanedContent,
        wordCount: cleanedContent.split(/\s+/).length,
        status: "completed",
      });

      // 5️⃣ Convert to HTML ONLY for response
      const htmlContent = toHtml(updatedEssay.contentFinal);

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Essay generated successfully",
        data: {
          ...updatedEssay,
          contentFinal: htmlContent,
        },
      });
    } catch (aiError) {
      console.error("AI ERROR:", aiError);

      await EssayService.updateEssay(prisma, essay.id, {
        status: "failed",
      });

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Essay generation failed",
      });
    }
  } catch (error) {
    next(error);
  }
};

// =========================
// EDIT essay text (USER)
// =========================
const updateEssayContent = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.userId;
    const { id } = req.params;
    let { contentFinal } = req.body;

    if (!contentFinal) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Essay content is required",
      });
    }

    // ✅ FIX HERE — normalize BEFORE saving
    contentFinal = normalizeEssayText(contentFinal);
   // 5️⃣ Convert to HTML ONLY for response
      const htmlContent = toHtml(contentFinal);
    const result = await EssayService.updateEssayContent(
      prisma,
      id,
      userId,
      contentFinal = htmlContent
    );

    if (result.count === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Essay not found or unauthorized",
      });
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Essay updated successfully",
    });
  } catch (error) {
    next(error);
  }
};


// =========================
// DELETE essay
// =========================
const deleteEssay = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.userId;
    const { id } = req.params;

    await EssayService.delete(prisma, id, userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Essay deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const EssayController = {
  getEssays,
  getEssayById,
  createEssay,
  updateEssayContent,
  deleteEssay,
};
