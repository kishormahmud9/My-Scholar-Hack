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
    const response = await axios.post(envVars.AI_SERVICE_URL, {
      title,
      prompt,
      voiceUrl,
      documentUrls,
    });

    return response.data;
  },
};
