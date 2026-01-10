import axios from "axios";
import { envVars } from "../../config/env.js";

export const EssayService = {
  // GET all essays by user
  getByUserId: async (prisma, userId) => {
    return prisma.essay.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  // GET single essay
  getById: async (prisma, id, userId) => {
    return prisma.essay.findFirst({
      where: { id, userId },
    });
  },

  // CREATE prompt first
  createPrompt: async (prisma, data) => {
    return prisma.essay.create({
      data: {
        ...data,
        status: "generating",
      },
    });
  },

  // UPDATE generated content
  updateGeneratedEssay: async (prisma, id, data) => {
    return prisma.essay.update({
      where: { id },
      data,
    });
  },

  // DELETE
  delete: async (prisma, id, userId) => {
    return prisma.essay.deleteMany({
      where: { id, userId },
    });
  },

  // AI CALL
  generateEssayByAI: async (title, prompt) => {
    const response = await axios.post(envVars.AI_SERVICE_URL, {
      title,
      prompt,
    });

    return response.data;
  },
};
