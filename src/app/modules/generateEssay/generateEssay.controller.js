import { StatusCodes } from "http-status-codes";
import { EssayService } from "./generateEssay.service.js";
import { normalizeEssayText } from "../../utils/normalizeEssayText.js";
import { toHtml } from "../../utils/toHtml.js";
import { ESSAY_STATUS } from "./generateEssay.service.js";
import { SubscriptionStudentService } from "../subscriptionStudent/subscriptionStudent.service.js";


// CREATE + AI GENERATE

const createEssay = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.id;
    const { subject, title, prompt } = req.body;

    // 1. Process Files (Voice & Documents)
    let voicePath = null;
    let documentPaths = [];

    if (req.files) {
      const allFiles = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();

      allFiles.forEach((file) => {
        const normalizedPath = file.path.replace(/\\/g, "/");
        if (file.fieldname === "voice" || file.fieldname === "audio") {
          voicePath = normalizedPath;
        } else if (["documents", "document", "file", "files"].includes(file.fieldname)) {
          documentPaths.push(normalizedPath);
        }
      });
    }

    // Validation: Ensure at least one input method is provided
    if (!prompt && !voicePath && documentPaths.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Input missing. Provide a 'prompt', 'voice' file, or 'documents' file.",
      });
    }

    // 2. Pre-generation Validations
    const profile = await EssayService.validateProfileCompletion(prisma, userId);
    await SubscriptionStudentService.validateEssayLimit(prisma, userId);

    // 3. Save Initial Prompt (Database Entry)
    const essay = await EssayService.createPrompt(prisma, {
      userId,
      subject,
      title,
      prompt: prompt || "Multi-modal essay generation",
      voiceUrl: voicePath,
      documentUrls: documentPaths,
      voiceFilePath: voicePath,
      documentFilePath: documentPaths,
      userProfileId: profile.id,
      scholarshipId: req.body.scholarshipId || null,
    });

    try {
      // 4. Call AI Service
      const aiResponse = await EssayService.generateEssayByAI(
        prompt || "Please generate an essay based on the attached files.",
        voicePath,
        documentPaths[0] || null // Passing first document for now as per current service capability
      );

      if (!aiResponse?.essay) {
        throw new Error("AI returned empty essay content");
      }

      // 5. Finalize Essay (Normalize & Update DB)
      const cleanedContent = normalizeEssayText(aiResponse.essay);

      const updatedEssay = await EssayService.updateEssay(
        prisma,
        essay.id,
        userId,
        {
          contentFinal: cleanedContent,
          wordCount: cleanedContent.trim().split(/\s+/).length,
          status: ESSAY_STATUS.SAVED,
        }
      );

      // 6. Success Response
      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Essay generated successfully",
        data: {
          ...updatedEssay,
          contentFinal: toHtml(updatedEssay.contentFinal),
        },
      });

    } catch (aiError) {
      console.error("AI Generation Error:", aiError.message);

      await EssayService.updateEssay(prisma, essay.id, userId, {
        status: ESSAY_STATUS.FAILED,
      });

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Essay generation failed",
        error: aiError.message
      });
    }
  } catch (error) {
    next(error);
  }
};





// GET all essays

const getEssays = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.id;

    const result = await EssayService.getByUserId(prisma, userId, req.query);

    res.status(StatusCodes.OK).json({
      success: true,
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};


// GET single essay

const getEssayById = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.id;
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




// EDIT essay text (USER)

const updateEssayContent = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.id;
    const { id } = req.params;
    let { contentFinal } = req.body;

    if (!contentFinal) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Essay content is required",
      });
    }

    // Normalize content (handling backslashes/escaped characters)
    const cleanedContent = normalizeEssayText(contentFinal);

    const result = await EssayService.updateEssayContent(
      prisma,
      id,
      userId,
      cleanedContent
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Essay updated successfully",
      data: {
        contentFinal: toHtml(cleanedContent)
      }
    });
  } catch (error) {
    next(error);
  }
};



// DELETE essay

const deleteEssay = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.id;
    const { id } = req.params;

    await EssayService.delete(prisma, id, userId);

    res.status(200).json({
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
