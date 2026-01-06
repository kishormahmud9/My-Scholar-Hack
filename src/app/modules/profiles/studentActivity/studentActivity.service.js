export const StudentActivityService = {
    create: async (prisma, data) => {
        return await prisma.studentActivity.create({
            data,
        });
    },

    update: async (prisma, id, data) => {
        return await prisma.studentActivity.update({
            where: { id },
            data,
        });
    },

    delete: async (prisma, id) => {
        return await prisma.studentActivity.delete({
            where: { id },
        });
    },

    findAllByProfileId: async (prisma, userProfileId) => {
        return await prisma.studentActivity.findMany({
            where: { userProfileId },
        });
    },
};
