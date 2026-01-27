


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

  getAll: async (prisma, query, filter = {}) => {
    const builder = new QueryBuilder(query)
      .search([
        "reason",
        { scholarship: scholarshipSearchableFields },
      ])
      .filter({
        scholarship: ["type", "amount", "provider", "subject"],
      })
      .sort("-createdAt", {
        scholarship: ["type", "amount", "provider", "subject"],
      })
      .fields()
      .paginate();

    const prismaQuery = builder.build();

    prismaQuery.where = {
      ...(prismaQuery.where || {}),
      ...filter,
    };

    // Prisma doesn't allow both 'select' and 'include' at the same level.
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
  },

  getByUserId: async (prisma, userId, query) => {
    return RecommendationService.getAll(prisma, query, { userId });
  },

  getAllScholarships: async (prisma, query) => {
    const builder = new QueryBuilder(query)
      .search(scholarshipSearchableFields)
      .filter()
      .sort("-createdAt")
      .fields()
      .paginate();

    const prismaQuery = builder.build();

    const data = await prisma.scholarship.findMany(prismaQuery);
    const total = await prisma.scholarship.count({
      where: prismaQuery.where,
    });

    return {
      data,
      meta: builder.getMeta(total),
    };
  },
};

