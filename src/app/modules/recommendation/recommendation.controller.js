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
      const scholarship =
        await RecommendationService.upsertScholarship(prisma, {
          title: item.title,
          type: item.type,
          amount: item.amount ?? 0,
          provider: item.from ?? "AI_RECOMMENDATION",
          deadline: item.deadline ? new Date(item.deadline) : null,
          description: item.description ?? null,
          images: item.images ?? [],
        })

      recommendationData.push({
        userId,
        scholarshipId: scholarship.id,
        score: item.score ?? 80,
        reason: item.reason ?? null,
      })
    }

    // SAVE RECOMMENDATIONS
    if (recommendationData.length) {
      await RecommendationService.createMany(prisma, recommendationData)
    }

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Recommendations generated successfully",
      data: recommendationData,
    })
  } catch (error) {
    next(error)
  }
}

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

export const RecommendationController = {
  generateRecommendations,
  getUserRecommendations,
}
