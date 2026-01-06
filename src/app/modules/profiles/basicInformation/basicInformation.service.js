export const BasicInformationService = {
  // 🔹 Create (POST)
  create: async (prisma, userProfileId, data) => {
    return prisma.basicInformation.create({
      data: {
        userProfileId,
        ...data,
      },
    });
  },

  // 🔹 Get by userProfileId (GET)
  getByUserProfileId: async (prisma, userProfileId) => {
    return prisma.basicInformation.findUnique({
      where: { userProfileId },
    });
  },

  // 🔹 Update by userProfileId (PUT/PATCH)
  updateByUserProfileId: async (prisma, userProfileId, data) => {
    return prisma.basicInformation.update({
      where: { userProfileId },
      data,
    });
  },

  // 🔹 Safe UPSERT (recommended)
  upsertByUserProfileId: async (prisma, userProfileId, data) => {
    return prisma.basicInformation.upsert({
      where: { userProfileId },
      update: data,
      create: {
        userProfileId,
        ...data,
      },
    });
  },
};
