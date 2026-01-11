import { StatusCodes } from "http-status-codes";
import { EssayService } from "./generateEssay.service.js";


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

const createEssay = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.userId;
    const { title, prompt, userProfileId, scholarshipId } = req.body;

    if (!prompt) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Prompt is required",
      });
    }

    // ================================
    // 1️⃣ Save prompt first
    // ================================
    const essay = await EssayService.createPrompt(prisma, {
      userId,
      title,
      prompt,
      userProfileId,
      scholarshipId,
    });

    try {
      // ================================
      // 2️⃣ Call AI API
      // ================================
      const aiResponse = await EssayService.generateEssayByAI(
        title,
        prompt
      );

      // ================================
      // 3️⃣ Update same essay
      // ================================
      const updatedEssay = await EssayService.updateEssay(
        prisma,
        essay.id,
        {
          contentFinal: aiResponse.content,
          wordCount:
            aiResponse.wordCount ??
            aiResponse.content?.split(" ").length,
          status: "completed",
        }
      );

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Essay generated successfully",
        data: updatedEssay,
      });
    } catch (aiError) {
      // ================================
      // AI failed, mark as failed
      // ================================
      await EssayService.updateEssay(prisma, essay.id, {
        status: "failed",
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Essay generation failed",
      });
    }
  } catch (error) {
    next(error);
  }
};

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
  deleteEssay,
};
