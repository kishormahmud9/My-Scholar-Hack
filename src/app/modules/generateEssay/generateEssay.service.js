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


  // UPDATE essay (AI or edit)

  updateEssay: async (prisma, id, data) => {
    return prisma.essay.update({
      where: { id },
      data,
    });
  },


  // UPDATE essay content (USER EDIT)

 updateEssayContent: async (prisma, id, userId, contentFinal) => {
  return prisma.essay.updateMany({
    where: {
      id,
      userId,
    },
    data: {
      contentFinal,
      wordCount: contentFinal.trim().split(/\s+/).length,
      status: "edited",
      updatedAt: new Date(),
    },
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
