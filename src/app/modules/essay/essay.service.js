export const EssayService = {
    // Essay Specific Questions Methods
    upsertSpecificQuestions: async (prisma, userProfileId, data) => {
        return await prisma.essaySpecificQuestions.upsert({
            where: { userProfileId },
            update: data,
            create: {
                userProfileId,
                ...data,
            },
        });
    },

    findSpecificQuestionsByProfileId: async (prisma, userProfileId) => {
        return await prisma.essaySpecificQuestions.findUnique({
            where: { userProfileId },
        });
    },

    // Individual Essay Methods
    createEssay: async (prisma, data) => {
        return await prisma.essay.create({
            data,
        });
    },

    updateEssay: async (prisma, id, data) => {
        return await prisma.essay.update({
            where: { id },
            data,
        });
    },

    deleteEssay: async (prisma, id) => {
        return await prisma.essay.delete({
            where: { id },
        });
    },

    findAllEssaysByProfileId: async (prisma, userProfileId) => {
        return await prisma.essay.findMany({
            where: { userProfileId },
        });
    },
};
