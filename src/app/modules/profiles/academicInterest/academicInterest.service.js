export const AcademicInterestService = {
    upsert: async (prisma, userProfileId, data) => {
        return await prisma.academicInterest.upsert({
            where: { userProfileId },
            update: data,
            create: {
                userProfileId,
                ...data,
            },
        });
    },

    findByProfileId: async (prisma, userProfileId) => {
        return await prisma.academicInterest.findUnique({
            where: { userProfileId },
        });
    },
};
