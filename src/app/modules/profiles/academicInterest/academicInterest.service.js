export const AcademicInterestService = {
  // GET
  getByUserProfileId: async (prisma, userProfileId) => {
    return prisma.academicInterest.findUnique({
      where: { userProfileId },
    });
  },

  // CREATE (POST)
  create: async (prisma, userProfileId, data) => {
    return prisma.academicInterest.create({
      data: {
        userProfileId,
        ...data,
      },
    });
  },

  // UPDATE (PUT/PATCH)
  update: async (prisma, userProfileId, data) => {
    return prisma.academicInterest.update({
      where: { userProfileId },
      data,
    });
  },
};
