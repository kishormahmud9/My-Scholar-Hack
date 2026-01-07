export const VolunteerService = {
  // GET
  getByProfileId: async (prisma, userProfileId) => {
    return prisma.volunteerWork.findUnique({
      where: { userProfileId },
    });
  },

  // POST (create)
  create: async (prisma, userProfileId, data) => {
    return prisma.volunteerWork.create({
      data: {
        userProfileId,
        ...data,
      },
    });
  },

  // UPDATE
  update: async (prisma, userProfileId, data) => {
    return prisma.volunteerWork.update({
      where: { userProfileId },
      data,
    });
  },
};
