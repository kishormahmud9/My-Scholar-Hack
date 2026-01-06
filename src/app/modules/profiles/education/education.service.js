export const EducationService = {
    create: async (prisma, data) => {
        return await prisma.education.create({
            data,
        });
    },

    update: async (prisma, id, data) => {
        return await prisma.education.update({
            where: { id },
            data,
        });
    },

    delete: async (prisma, id) => {
        return await prisma.education.delete({
            where: { id },
        });
    },

    findAllByProfileId: async (prisma, userProfileId) => {
        return await prisma.education.findMany({
            where: { userProfileId },
        });
    },
};
