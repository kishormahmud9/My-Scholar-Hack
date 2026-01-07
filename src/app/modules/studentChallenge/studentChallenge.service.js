export const StudentChallengeService = {
    create: async (prisma, data) => {
        return await prisma.studentChallenge.create({
            data,
        });
    },

    update: async (prisma, id, data) => {
        return await prisma.studentChallenge.update({
            where: { id },
            data,
        });
    },

    delete: async (prisma, id) => {
        return await prisma.studentChallenge.delete({
            where: { id },
        });
    },

    findAllByProfileId: async (prisma, userProfileId) => {
        return await prisma.studentChallenge.findMany({
            where: { userProfileId },
        });
    },
};
