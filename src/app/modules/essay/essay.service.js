export const EssayService = {
    // Essay Narrative Methods
    upsertNarrative: async (prisma, userProfileId, data) => {
        return await prisma.essayNarrative.upsert({
            where: { userProfileId },
            update: data,
            create: {
                userProfileId,
                ...data,
            },
        });
    },

    findNarrativeByProfileId: async (prisma, userProfileId) => {
        return await prisma.essayNarrative.findUnique({
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
