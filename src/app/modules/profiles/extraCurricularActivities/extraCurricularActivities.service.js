export const ExtracurricularActivityService = {
  // GET by profile
  getByUserProfileId: async (prisma, userProfileId) => {
    return prisma.extracurricularActivity.findUnique({
      where: { userProfileId },
    });
  },

  // CREATE
  create: async (prisma, userProfileId, data) => {
    return prisma.extracurricularActivity.create({
      data: {
        userProfileId,
        ...data,
      },
    });
  },

  // UPDATE
  update: async (prisma, userProfileId, data) => {
    return prisma.extracurricularActivity.update({
      where: { userProfileId },
      data,
    });
  },
};
