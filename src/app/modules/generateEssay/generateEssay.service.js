import axios from "axios";
import { envVars } from "../../config/env.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { essaySearchableFields, scholarshipSearchableFields } from "./generateEssay.constant.js";

export const EssayService = {

  // GET all essays by user

  getByUserId: async (prisma, userId, query) => {
    const builder = new QueryBuilder(query)
      .search(essaySearchableFields)
      .filter({
        scholarship: ["type", "from"],
      })
      .sort("-createdAt", {
        scholarship: ["type", "from"],
      })
      .fields()
      .paginate();

    const prismaQuery = builder.build();

    prismaQuery.where = {
      ...(prismaQuery.where || {}),
      userId,
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
