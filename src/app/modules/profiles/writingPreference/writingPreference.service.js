export const WritingPreferenceService = {
    upsert: async (prisma, userProfileId, data) => {
        return await prisma.writingPreference.upsert({
            where: { userProfileId },
            update: data,
            create: {
                userProfileId,
                ...data,
            },
        });
    },

    findByProfileId: async (prisma, userProfileId) => {
        return await prisma.writingPreference.findUnique({
            where: { userProfileId },
        });
    },
};
