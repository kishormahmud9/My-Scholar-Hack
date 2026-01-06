export const FamilyBackgroundService = {
    upsert: async (prisma, userProfileId, data) => {
        return await prisma.familyBackground.upsert({
            where: { userProfileId },
            update: data,
            create: {
                userProfileId,
                ...data,
            },
        });
    },

    findByProfileId: async (prisma, userProfileId) => {
        return await prisma.familyBackground.findUnique({
            where: { userProfileId },
        });
    },
};
