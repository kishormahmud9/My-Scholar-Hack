import { StatusCodes } from "http-status-codes";
import { EssayService } from "./generateEssay.service.js";
import { normalizeEssayText } from "../../utils/normalizeEssayText.js";
import { toHtml } from "../../utils/toHtml.js";
import { ESSAY_STATUS } from "./generateEssay.service.js";
import { SubscriptionStudentService } from "../subscriptionStudent/subscriptionStudent.service.js";


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


// CREATE + AI GENERATE

const createEssay = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.id;
    const profileId = req.user.userProfileId;
    const scholarshipId = req.user.scholarshipId;
    const { subject, title, prompt } = req.body;

    // DEBUG LOGS
    console.log("=== CREATE ESSAY REQUEST DEBUG ===");
    console.log("Headers:", req.headers); // 👈 Added to check Content-Type
    console.log("Body Keys:", Object.keys(req.body));
    console.log("File Keys:", req.files ? Object.keys(req.files) : "No Files");
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        console.log(`- Field '${key}' contains ${req.files[key].length} files`);
      });
    }
    console.log("Values:", { hasPrompt: !!prompt, hasSubject: !!subject, hasTitle: !!title });
    console.log("==================================");

    const voice = req.files?.voice?.[0]?.path?.replace(/\\/g, "/");
    const documents = req.files?.documents?.map((file) => file.path.replace(/\\/g, "/")) || [];

    if (!prompt && !voice && !documents.length) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Input missing. You must provide a 'prompt' (text), or a 'voice' (file), or 'documents' (files).",
        receivedFields: {
          body: Object.keys(req.body),
          files: req.files ? Object.keys(req.files) : []
        }
      });
    }

    // 0️⃣ Validate profile completion
    await EssayService.validateProfileCompletion(prisma, userId);

    // 1️⃣ Validate subscription limits
    await SubscriptionStudentService.validateEssayLimit(prisma, userId);

    // 2️⃣ Save prompt
    const essay = await EssayService.createPrompt(prisma, {
      userId,
      subject,
      title,
      prompt: prompt || "Multi-modal essay generation",
      voiceUrl: voice,
      documentUrls: documents,
      voiceFilePath: voice,
      documentFilePath: documents,
      userProfileId: profileId,
      scholarshipId,
    });

    try {
      // 2️⃣ Call AI
      const aiResponse = await EssayService.generateEssayByAI(
        title,
        prompt || "Please generate an essay based on the attached files.",
        voice,
        documents
      );

      if (!aiResponse?.essay) {
        throw new Error("AI returned empty essay");
      }

      // 3️⃣ Normalize escaped text
      const cleanedContent = normalizeEssayText(aiResponse.essay);

      // 4️⃣ Save CLEAN TEXT ONLY
      const updatedEssay = await EssayService.updateEssay(
        prisma,
        essay.id,
        userId,
        {
          contentFinal: cleanedContent,
          wordCount: cleanedContent.split(/\s+/).length,
          status: ESSAY_STATUS.SAVED,
        }
      );

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
      console.error("=== AI GENERATION ERROR ===");
      if (aiError.response) {
        console.error("Response Data:", aiError.response.data);
        console.error("Response Status:", aiError.response.status);
      } else {
        console.error("Error Message:", aiError.message);
      }
      console.error("===========================");

      await EssayService.updateEssay(prisma, essay.id, userId, {
        status: ESSAY_STATUS.FAILED,
      });

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Essay generation failed",
        error: aiError.response?.data || aiError.message
      });
    }
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

    // ✅ FIX HERE — normalize BEFORE saving
    contentFinal = normalizeEssayText(contentFinal);
    // 5️⃣ Convert to HTML ONLY for response
    const htmlContent = toHtml(contentFinal);
    // ✅ FIX: Pass clean contentFinal, NOT htmlContent
    const result = await EssayService.updateEssayContent(
      prisma,
      id,
      userId,
      contentFinal
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
