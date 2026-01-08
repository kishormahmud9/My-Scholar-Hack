export const StudentWorkService = {
    create: async (prisma, data) => {
        return await prisma.studentWork.create({
            data,
        });
    },

    update: async (prisma, id, data) => {
        return await prisma.studentWork.update({
            where: { id },
            data,
        });
    },

    delete: async (prisma, id) => {
        return await prisma.studentWork.delete({
            where: { id },
        });
    },

    findAllByProfileId: async (prisma, userProfileId) => {
        return await prisma.studentWork.findMany({
            where: { userProfileId },
        });
    },
};
