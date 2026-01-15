// ES MODULE ✅

export const ApplicationService = {

  // CREATE application

  createApplication: async (prisma, userId, essayId, scholarshipId) => {
    // 1️⃣ Validate essay ownership
    const essay = await prisma.essay.findFirst({
      where: {
        id: essayId,
        userId,
        isDeleted: false,
      },
    });

    if (!essay) {
      const error = new Error("Essay not found or not authorized");
      error.statusCode = 404;
      throw error;
    }

    // 2️⃣ Validate scholarship
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: scholarshipId },
    });

    if (!scholarship) {
      const error = new Error("Scholarship not found");
      error.statusCode = 404;
      throw error;
    }

    // 3️⃣ Prevent duplicate application
    const existing = await prisma.application.findFirst({
      where: {
        userId,
        scholarshipId,
      },
    });

    if (existing) {
      return ("Already applied to this scholarship")
    }

    // 4️⃣ Create application with snapshots
    return prisma.application.create({
      data: {
        userId,
        essayId,
        scholarshipId,
        status: "PROCESSING", // Prisma enum ✅
        essayTitle: essay?.title || null,
        scholarshipTitle: scholarship.title,
        scholarshipAmount: scholarship.amount,
        scholarshipDeadline: scholarship.deadline,
      },
    });
  },


  // GET applications by user

  getByUserId: async (prisma, userId) => {
    return prisma.application.findMany({
      where: { userId },
      include: {
        scholarship: {
          select: {
            title: true,
            amount: true,
            deadline: true,
          },
        },
        essay: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },


  // UPDATE application status

  updateStatus: async (prisma, applicationId, userId, status) => {
    const result = await prisma.application.updateMany({
      where: {
        id: applicationId,
        userId,
      },
      data: { status },
    });

    if (result.count === 0) {
      const error = new Error("Application not found or not authorized");
      error.statusCode = 404;
      throw error;
    }

    return result;
  },

  // ===============================
  // GET single application
  // ===============================
  getById: async (prisma, applicationId, userId) => {
    return prisma.application.findFirst({
      where: {
        id: applicationId,
        userId,
      },
      include: {
        scholarship: true,
        essay: true,
      },
    });
  },
};
