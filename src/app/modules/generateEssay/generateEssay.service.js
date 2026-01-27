import axios from "axios";
import { envVars } from "../../config/env.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import {
  essaySearchableFields,
} from "./generateEssay.constant.js";

// src/constants/essayStatus.js
export const ESSAY_STATUS = {
  GENERATING: "GENERATING",
  SAVED: "SAVED",
  FAILED: "FAILED",
  EDITED: "EDITED",
};


export const EssayService = {

  // GET all essays by user
  getByUserId: async (prisma, userId, query) => {
    const builder = new QueryBuilder(query)
      .search([
        ...essaySearchableFields
      ])
      .filter({
        scholarship: ["type", "from"],
      })
      .sort("-createdAt", {
        scholarship: ["type", "from"],
      })
      .fields()
      .paginate();

    const prismaQuery = builder.build();

    // 🔥 ALWAYS exclude deleted essays
    prismaQuery.where = {
      ...(prismaQuery.where || {}),
      userId,
      isDeleted: false,
    };

    // Handle select/include conflict
    if (prismaQuery.select) {
      prismaQuery.select.scholarship = true;
    } else {
      prismaQuery.include = {
        scholarship: true,
      };
    }

    const data = await prisma.essay.findMany(prismaQuery);

    const total = await prisma.essay.count({
      where: prismaQuery.where,
    });

    return {
      data,
      meta: builder.getMeta(total),
    };
  },

  // GET single essay
  getById: async (prisma, id, userId) => {
    return prisma.essay.findFirst({
      where: {
        id,
        userId,
        isDeleted: false,
      },
    });
  },

  // CREATE prompt first
  createPrompt: async (prisma, data) => {
    return prisma.essay.create({
      data: {
        ...data,
        status: ESSAY_STATUS.GENERATING,
        voiceUrl: data.voiceUrl || null,
        documentUrls: data.documentUrls || [],
        voiceFilePath: data.voiceFilePath || null,
        documentFilePath: data.documentFilePath || [],
        isDeleted: false,
      },
    });
  },

  // UPDATE essay (AI or edit)
  updateEssay: async (prisma, id, userId, data) => {
    const essay = await prisma.essay.findFirst({
      where: {
        id,
        userId,
        isDeleted: false,
      },
    });

    if (!essay) {
      const error = new Error("Essay not found or not authorized");
      error.statusCode = 404;
      throw error;
    }

    return prisma.essay.update({
      where: { id },
      data,
    });
  },

  // UPDATE essay content (USER EDIT)
  updateEssayContent: async (prisma, id, userId, contentFinal) => {
    const result = await prisma.essay.updateMany({
      where: {
        id,
        userId,
        isDeleted: false,
      },
      data: {
        contentFinal,
        wordCount: contentFinal.trim().split(/\s+/).length,
        status: ESSAY_STATUS.EDITED,
        updatedAt: new Date(),
      },
    });

    if (result.count === 0) {
      const error = new Error("Essay not found or not authorized");
      error.statusCode = 404;
      throw error;
    }

    return result;
  },

  // SOFT DELETE essay
  delete: async (prisma, id, userId) => {
    const essay = await prisma.essay.findFirst({
      where: {
        id,
        userId,
        isDeleted: false,
      },
    });

    if (!essay) {
      const error = new Error("Essay not found or not authorized");
      error.statusCode = 404;
      throw error;
    }

    return prisma.essay.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  },

  // AI CALL
  generateEssayByAI: async (title, prompt, voiceUrl = null, documentUrls = []) => {
    // Convert local paths to full URLs if they exist
    const fullVoiceUrl = voiceUrl ? `${envVars.SERVER_URL}/${voiceUrl}` : null;
    const fullDocumentUrls = documentUrls.map(doc => `${envVars.SERVER_URL}/${doc}`);

    const response = await axios.post(envVars.AI_SERVICE_URL, {
      title,
      prompt,
      voiceUrl: fullVoiceUrl,
      documentUrls: fullDocumentUrls,
    });

    return response.data;
  },

  // 🛡️ VALIDATE profile completion
  validateProfileCompletion: async (prisma, userId) => {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        basicInformation: true,
        academicInterest: true,
        education: true,
        extraCurricularsActivity: true,
        volunteerWork: true,
        familyBackground: true,
        uniqueExperience: true,
        diversityIdentity: true,
        scholarshipSpecificInfo: true,
        essaySpecificQuestions: true,
      },
    });

    if (!profile) {
      const error = new Error("Please complete your profile first.");
      error.statusCode = 400;
      throw error;
    }

    const sections = [
      { name: "Basic Information", data: profile.basicInformation },
      { name: "Academic Interest", data: profile.academicInterest },
      { name: "Education", data: profile.education },
      { name: "Extra Curriculars Activity", data: profile.extraCurricularsActivity },
      { name: "Volunteer Work", data: profile.volunteerWork },
      { name: "Family Background", data: profile.familyBackground },
      { name: "Unique Experience", data: profile.uniqueExperience },
      { name: "Diversity Identity", data: profile.diversityIdentity },
      { name: "Scholarship Specific Info", data: profile.scholarshipSpecificInfo },
      { name: "Essay Specific Questions", data: profile.essaySpecificQuestions },
    ];

    const missingSections = sections
      .filter((s) => !s.data)
      .map((s) => s.name);

    if (missingSections.length > 0) {
      const error = new Error(
        `Please complete the following profile sections: ${missingSections.join(", ")}`
      );
      error.statusCode = 400;
      throw error;
    }

    return profile;
  },
};

