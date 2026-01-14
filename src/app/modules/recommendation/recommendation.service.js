


import axios from "axios"
import { envVars } from "../../config/env.js"
import { QueryBuilder } from "../../utils/QueryBuilder.js"
import { scholarshipSearchableFields } from "./recommendation.constant.js"


export const RecommendationService = {
  // CALL AI RECOMMENDATION API
  getRecommendationsFromAI: async (userId) => {
    // Robust URL construction to avoid double slashes
    const baseUrl = envVars.AI_RECOMMENDATION_API_URL.replace(/\/$/, "");
    const url = `${baseUrl}/${userId}`;
    console.log("🚀 Calling AI Recommendation service at:", url);

    // Try GET first as per original logic, but with more debugging
    const response = await axios.get(
      url,
      {
        timeout: 60000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    return response.data
  },

  // UPSERT SCHOLARSHIP
  upsertScholarship: async (prisma, scholarship) => {
    return prisma.scholarship.upsert({
      where: {
        title_provider: {
          title: scholarship.title,
          provider: scholarship.provider,
        },
      },
      update: scholarship,
      create: scholarship,
    })
  },

  // SAVE USER RECOMMENDATIONS
  createMany: async (prisma, recommendations) => {
    return prisma.recommendation.createMany({
      data: recommendations,
    })
  },

  getByUserId: async (prisma, userId, query) => {
    const builder = new QueryBuilder(query)
      .search([
        "reason",
        { scholarship: scholarshipSearchableFields },
      ])
      .filter({
        scholarship: ["type", "amount", "provider"],
      })
      .sort("-createdAt", {
        scholarship: ["type", "amount", "provider"],
      })
      .fields()
      .paginate();

    const prismaQuery = builder.build();

    prismaQuery.where = {
      ...(prismaQuery.where || {}),
      userId,
    };

    // Prisma doesn't allow both 'select' and 'include' at the same level.
    // If 'select' is present, we must put 'scholarship' inside it.
    if (prismaQuery.select) {
      prismaQuery.select.scholarship = true;
    } else {
      prismaQuery.include = {
        scholarship: true,
      };
    }

    const data = await prisma.recommendation.findMany(prismaQuery);

    const total = await prisma.recommendation.count({
      where: prismaQuery.where,
    });

    return {
      data,
      meta: builder.getMeta(total),
    };
  }

}
