export const StudentVolunteerService = {
    create: async (prisma, data) => {
        return await prisma.studentVolunteer.create({
            data,
        });
    },

    update: async (prisma, id, data) => {
        return await prisma.studentVolunteer.update({
            where: { id },
            data,
        });
    },

    delete: async (prisma, id) => {
        return await prisma.studentVolunteer.delete({
            where: { id },
        });
    },

    findAllByProfileId: async (prisma, userProfileId) => {
        return await prisma.studentVolunteer.findMany({
            where: { userProfileId },
        });
    },
};
