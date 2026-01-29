


import axios from "axios";
import { envVars } from "../../config/env.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import { scholarshipSearchableFields } from "./recommendation.constant.js";


export const RecommendationService = {
  // CALL AI RECOMMENDATION API
  getRecommendationsFromAI: async (userId) => {
    // Robust URL construction to avoid double slashes
    const baseUrl = envVars.AI_RECOMMENDATION_API_URL.replace(/\/$/, "");
    const url = `${baseUrl}/${userId}`.replace(/([^:]\/)\/+/g, "$1");
    console.log("🚀 Calling AI Recommendation service at:", url);

    // Try GET call with correct Axios parameters
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

  // TRIGGER SCHOLARSHIP SYNC FROM EXTERNAL API
  triggerScholarshipSync: async () => {
    try {
      const url = envVars.SCHOLARSHIP_GETTING_API;
      console.log("🚀 Triggering scholarship sync (POST):", url);

      const response = await axios.post(url, {}, {
        timeout: 60000,
      });

      console.log("✅ Sync trigger response:", response.data);
      return response.data; // { status: "...", count: ... }
    } catch (error) {
      console.error("❌ Error triggering scholarship sync:", error);
      throw error;
    }
  },

  // SAVE SCHOLARSHIPS TO DATABASE
  saveScholarships: async (prisma, data) => {
    try {
      if (!Array.isArray(data)) {
        console.log("⚠️ Received non-array data to save. Type:", typeof data);

        // Robust extraction logic
        let foundArray = null;
        if (typeof data === 'object' && data !== null) {
          const wrapperKeys = ['data', 'scholarships', 'results', 'result', 'items'];
          for (const key of wrapperKeys) {
            if (Array.isArray(data[key])) {
              foundArray = data[key];
              break;
            }
          }
          if (!foundArray) {
            for (const key in data) {
              if (Array.isArray(data[key])) {
                foundArray = data[key];
                break;
              }
            }
          }
        }

        if (!foundArray) {
          console.log("❌ No array found in data:", JSON.stringify(data, null, 2));
          throw new Error("Could not find scholarship array in the provided data");
        }
        data = foundArray;
      }

      console.log(`📦 Processing ${data.length} scholarships`);
      for (const item of data) {
        const deadlineDate = (() => {
          if (!item.deadline) return null;
          const d = new Date(item.deadline);
          return isNaN(d.getTime()) ? null : d;
        })();

        // 💰 Extract amount from title or provided field
        const amountFromTitle = item.title?.match(/\$([\d,]+)/)?.[1]?.replace(/,/g, "");
        const parsedAmount = amountFromTitle
          ? parseInt(amountFromTitle, 10)
          : (item.amount ? parseInt(String(item.amount).replace(/[^0-9]/g, ""), 10) : 0);

        await RecommendationService.upsertScholarship(prisma, {
          title: item.title ? item.title.replace(/"/g, "") : item.title,
          type: item.type || "Other",
          amount: parsedAmount || 0,
          provider: item.provider || item.from || "EXTERNAL_API",
          deadline: deadlineDate,
          subject: item.subject ?? null,
          description: item.description ?? null,
          images: item.images ?? [],
        });
      }

      return { success: true, count: data.length };
    } catch (error) {
      console.error("❌ Error saving scholarships:", error);
      throw error;
    }
  },
};
