export const StudentIdentityService = {
    upsert: async (prisma, userProfileId, data) => {
        return await prisma.studentIdentity.upsert({
            where: { userProfileId },
            update: data,
            create: {
                userProfileId,
                ...data,
            },
        });
    },

    findByProfileId: async (prisma, userProfileId) => {
        return await prisma.studentIdentity.findUnique({
            where: { userProfileId },
        });
    },
};
