export const VolunteerService = {
  // GET
  getByProfileId: async (prisma, userProfileId) => {
    return prisma.studentVolunteer.findUnique({
      where: { userProfileId },
    });
  },

  // POST (create)
  create: async (prisma, userProfileId, data) => {
    return prisma.studentVolunteer.create({
      data: {
        userProfileId,
        ...data,
      },
    });
  },

  // UPDATE
  update: async (prisma, userProfileId, data) => {
    return prisma.studentVolunteer.update({
      where: { userProfileId },
      data,
    });
  },
};
