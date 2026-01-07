export const StudentAwardService = {
    create: async (prisma, data) => {
        return await prisma.studentAward.create({
            data,
        });
    },

    update: async (prisma, id, data) => {
        return await prisma.studentAward.update({
            where: { id },
            data,
        });
    },

    delete: async (prisma, id) => {
        return await prisma.studentAward.delete({
            where: { id },
        });
    },

    findAllByProfileId: async (prisma, userProfileId) => {
        return await prisma.studentAward.findMany({
            where: { userProfileId },
        });
    },
};
