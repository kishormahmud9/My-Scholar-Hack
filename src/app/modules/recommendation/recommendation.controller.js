import { StatusCodes } from "http-status-codes"
import { RecommendationService } from "./recommendation.service.js"

const generateRecommendations = async (req, res, next) => {
  try {
    const prisma = req.prisma
    const userId = req.user.id

    // CALL AI SERVICE
    const aiResponse =
      await RecommendationService.getRecommendationsFromAI(userId)

    const aiResults = aiResponse?.recommendations
    console.log('ai results', aiResults)
    if (!Array.isArray(aiResults)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid AI recommendation response",
      })
    }

    // CLEAR OLD RECOMMENDATIONS
    await prisma.recommendation.deleteMany({
      where: { userId },
    })

    const recommendationData = []

    // UPSERT SCHOLARSHIPS + PREPARE RECOMMENDATIONS
    for (const item of aiResults) {
      const deadlineDate = (() => {
        if (!item.deadline) return null;
        const d = new Date(item.deadline);
        return isNaN(d.getTime()) ? null : d;
      })();

      // 💰 Extract amount from title or provided field
      const amountFromTitle = item.title?.match(/\$(\d{1,3}(,\d{3})*)/)?.[1]?.replace(/,/g, "");
      const parsedAmount = amountFromTitle
        ? parseInt(amountFromTitle, 10)
        : (item.amount ? parseInt(String(item.amount).replace(/[^0-9]/g, ""), 10) : 0);

      const scholarship =
        await RecommendationService.upsertScholarship(prisma, {
          title: item.title ? item.title.replace(/"/g, "") : item.title,
          type: item.type,
          amount: parsedAmount || 0,
          provider: item.from ?? "AI_RECOMMENDATION",
          deadline: deadlineDate,
          subject: item.subject ?? null,
          description: item.description ?? null,
          images: item.images ?? [],
        })

      recommendationData.push({
        userId,
        scholarshipId: scholarship.id,
        score: item.score ?? 80,
        reason: item.reason || "Recommended based on your profile matching criteria.",
      })
    }

    // SAVE RECOMMENDATIONS
    if (recommendationData.length) {
      await RecommendationService.createMany(prisma, recommendationData)
    }

    // FETCH CREATED RECOMMENDATIONS WITH SCHOLARSHIP DATA
    const result = await prisma.recommendation.findMany({
      where: { userId },
      include: {
        scholarship: true,
      },
    })

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Recommendations generated successfully",
      data: result,
    })
  } catch (error) {
    next(error);
  }
};

const getUserRecommendations = async (req, res, next) => {
  try {
    const prisma = req.prisma
    const userId = req.user.id

    // ✅ PASS QUERY PARAMS TO SERVICE
    const result =
      await RecommendationService.getByUserId(
        prisma,
        userId,
        req.query
      )

    res.status(StatusCodes.OK).json({
      success: true,
      meta: result.meta,
      data: result.data,
    })
  } catch (error) {
    next(error)
  }
}

const getAllRecommendations = async (req, res, next) => {
  try {
    const prisma = req.prisma

    const result = await RecommendationService.getAll(
      prisma,
      req.query
    )

    res.status(StatusCodes.OK).json({
      success: true,
      meta: result.meta,
      data: result.data,
    })
  } catch (error) {
    next(error)
  }
}

const getRecommendationByUserId = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const { userId } = req.params;

    const result = await RecommendationService.getByUserId(
      prisma,
      userId,
      req.query
    );

    res.status(StatusCodes.OK).json({
      success: true,
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const getScholarships = async (req, res, next) => {
  try {
    const prisma = req.prisma;

    const result = await RecommendationService.getAllScholarships(
      prisma,
      req.query
    );

    res.status(StatusCodes.OK).json({
      success: true,
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

const syncScholarships = async (req, res, next) => {
  try {
    const prisma = req.prisma;

    // 1. Trigger the sync and wait for results
    const syncResult = await RecommendationService.triggerScholarshipSync();

    // 2. Save the received scholarships directly
    const saveResult = await RecommendationService.saveScholarships(prisma, syncResult);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Scholarships synchronized and saved successfully",
      count: saveResult.count,
    });
  } catch (error) {
    next(error);
  }
};


export const RecommendationController = {
  generateRecommendations,
  getUserRecommendations,
  getAllRecommendations,
  getRecommendationByUserId,
  getScholarships,
  syncScholarships,
};

