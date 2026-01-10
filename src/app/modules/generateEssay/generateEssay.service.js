import { PrismaClient } from "@prisma/client";
import { aiClient } from "../utils/aiClient.js";

const prisma = new PrismaClient();

/**
 * Create essay, call AI, then update same record
 */
export const createEssayWithAI = async ({
  userId,
  title,
  prompt,
  userProfileId,
  scholarshipId,
}) => {
  // 1. Save prompt first
  const essay = await prisma.essay.create({
    data: {
      userId,
      title,
      prompt,
      userProfileId,
      scholarshipId,
      status: "generating",
    },
  });

  try {
    // 2. Call AI API
    const aiResponse = await aiClient.post("/generate-essay", {
      title,
      prompt,
    });

    const { content, wordCount } = aiResponse.data;

    // 3. Update same essay with generated content
    const updatedEssay = await prisma.essay.update({
      where: { id: essay.id },
      data: {
        contentFinal: content,
        wordCount: wordCount ?? content.split(" ").length,
        status: "completed",
      },
    });

    return updatedEssay;
  } catch (error) {
    // If AI fails, keep the prompt but mark failed
    await prisma.essay.update({
      where: { id: essay.id },
      data: { status: "failed" },
    });

    throw error;
  }
};

/**
 * Get all essays for user
 */
export const getEssaysByUser = async (userId) => {
  return prisma.essay.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Get single essay
 */
export const getEssayById = async (id, userId) => {
  return prisma.essay.findFirst({
    where: { id, userId },
  });
};

/**
 * Update essay manually
 */
export const updateEssay = async (id, userId, data) => {
  return prisma.essay.updateMany({
    where: { id, userId },
    data,
  });
};

/**
 * Delete essay
 */
export const deleteEssay = async (id, userId) => {
  return prisma.essay.deleteMany({
    where: { id, userId },
  });
};
