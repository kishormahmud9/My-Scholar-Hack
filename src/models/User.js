export const UserModel = {
  create: async (prisma, data) => prisma.user.create({ data }),
  findByEmail: async (prisma, email) =>
    prisma.user.findUnique({ where: { email } }),
  findByUsername: async (prisma, username) =>
    prisma.user.findUnique({ where: { username } }),
  findById: async (prisma, id) => prisma.user.findUnique({ where: { id } }),
  findAll: async (prisma) =>
    prisma.user.findMany({
      include: { business: true },
    }),
     // ✅ Update user by ID
  update: async (prisma, id, data) =>
    prisma.user.update({
      where: { id },
      data,
    }),

  // ✅ Delete user by ID
  delete: async (prisma, id) =>
    prisma.user.delete({
      where: { id },
    }),
};
