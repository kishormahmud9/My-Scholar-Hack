export const UniqueExperienceService = {
    upsert: async (prisma, userProfileId, data) => {
        return await prisma.uniqueExperience.upsert({
            where: { userProfileId },
            update: data,
            create: {
                userProfileId,
                ...data,
            },
        });
    },

    findByProfileId: async (prisma, userProfileId) => {
        return await prisma.uniqueExperience.findUnique({
            where: { userProfileId },
        });
    },
};
