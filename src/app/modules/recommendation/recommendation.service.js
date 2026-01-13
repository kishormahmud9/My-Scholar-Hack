import axios from "axios";
import { envVars } from "../../config/env.js";

export const RecommendationService = {
  // CALL AI RECOMMENDATION API
  getRecommendationsFromAI: async (userId) => {
    const response = await axios.get(
      `${envVars.AI_RECOMMENDATION_API_URL}/${userId}`,
      {
        timeout: 60000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  },

  // UPSERT SCHOLARSHIP
  upsertScholarship: async (prisma, scholarship) => {
    return prisma.scholarship.upsert({
      where: {
        title_from: {
          title: scholarship.title,
          from: scholarship.from,
        },
      },
      update: {
        ...scholarship,
      },
      create: {
        ...scholarship,
      },
    });
  },

  // SAVE USER RECOMMENDATIONS
  createMany: async (prisma, recommendations) => {
    return prisma.recommendation.createMany({
      data: recommendations,
    });
  },

  // GET USER RECOMMENDATIONS
  getByUserId: async (prisma, userId) => {
    return prisma.recommendation.findMany({
      where: { userId },
      include: {
        scholarship: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
