import { StatusCodes } from "http-status-codes";
import { RecommendationService } from "./recommendation.service.js";

const generateRecommendations = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.userId;
const aiResponse =
  await RecommendationService.getRecommendationsFromAI(userId);

const aiResults = aiResponse?.recommendations;
console.log('aiResults > ',aiResults)
if (!Array.isArray(aiResults)) {
  return res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: "Invalid AI recommendation response",
  });
}

    // CLEAR OLD RECOMMENDATIONS
    await prisma.recommendation.deleteMany({
      where: { userId },
    });

    const recommendationData = [];

    // SAVE SCHOLARSHIPS + RECOMMENDATIONS
   for (const item of aiResults) {
  const scholarship =
    await RecommendationService.upsertScholarship(
      prisma,
      {
        title: item.title,
        type: item.type,
        amount: item.amount ?? 0,
        from: item.from ?? "AI_RECOMMENDATION",
        deadline: item.deadline
          ? new Date(item.deadline)
          : null,
        description: item.description ?? null,
        images: item.images ?? [],
      }
    );

  recommendationData.push({
    userId,
    scholarshipId: scholarship.id,
    score: item.score ?? 80,
    reason: item.reason,
  });
}

    // SAVE RECOMMENDATIONS
    await RecommendationService.createMany(
      prisma,
      recommendationData
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Recommendations generated successfully",
      data: recommendationData,
    });
  } catch (error) {
    next(error);
  }
};

const getUserRecommendations = async (req, res, next) => {
  try {
    const prisma = req.prisma;
    const userId = req.user.userId;

    const data =
      await RecommendationService.getByUserId(prisma, userId);

    res.status(StatusCodes.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const RecommendationController = {
  generateRecommendations,
  getUserRecommendations,
};
