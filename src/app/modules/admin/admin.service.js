import bcrypt from "bcrypt";
import crypto from "crypto";

export const AdminService = {
  // =========================
  // GET USER INFO
  // =========================
  getUserInfo: async (prisma, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: "student",
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          profile: {
            select: { firstName: true },
          },
          essays: {
            select: { id: true },
          },
          subscriptions: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: {
              plan: {
                select: { internalName: true },
              },
            },
          },
        },
      }),

      prisma.user.count({
        where: {
          role: "student",
        },
      }),
    ]);

    const formattedUsers = users.map((user, index) => {
      const latestSubscription = user.subscriptions[0];

      return {
        no: skip + index + 1,
        id: user.id,
        name: user.profile?.firstName || user.name,
        email: user.email,
        totalEssays: user.essays.length,
        subscriptionPlan: latestSubscription?.plan?.internalName || "Free",
        status: latestSubscription ? "active" : "inactive",
      };
    });

    return {
      meta: {
        total,
        page,
        limit,
      },
      users: formattedUsers,
    };
  },

  // =========================
  // UPDATE USER STATUS
  // =========================
  updateUserStatus: async (prisma, userId, status) => {
    const allowedStatus = ["active", "inactive"];

    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid status. Allowed: active, inactive");
    }

    const latestSubscription = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // =========================
    // SET INACTIVE
    // =========================
    if (status === "inactive") {
      if (!latestSubscription) {
        return { message: "User already inactive" };
      }

      await prisma.subscription.delete({
        where: { id: latestSubscription.id },
      });

      return { message: "User deactivated successfully" };
    }

    // =========================
    // SET ACTIVE
    // =========================
    if (latestSubscription) {
      return { message: "User already active" };
    }

    // 🔑 FIND ANY EXISTING PLAN (NO ASSUMPTION)
    const plan = await prisma.plan.findFirst({
      orderBy: { monthlyPrice: "asc" }, // cheapest plan
    });

    if (!plan) {
      throw new Error("No plan exists. Admin must create a plan first.");
    }

    return prisma.subscription.create({
      data: {
        status: "active",
        user: {
          connect: { id: userId },
        },
        plan: {
          connect: { id: plan.id },
        },
      },
    });
  },

  // =========================
  // DELETE USER (HARD DELETE)
  // =========================
  deleteUser: async (prisma, userId) => {
    return prisma.$transaction([
      prisma.notification.deleteMany({ where: { userId } }),
      prisma.essay.deleteMany({ where: { userId } }),
      prisma.subscription.deleteMany({ where: { userId } }),
      prisma.application.deleteMany({ where: { userId } }),
      prisma.userProfile.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ]);
  },

  // =========================
  // CREATE ADMIN
  // =========================
  createAdmin: async (prisma, data) => {
    const { name, email, number } = data;

    // 1️⃣ Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // 2️⃣ FIXED DEFAULT PASSWORD
    const defaultPassword = "Admin@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // 3️⃣ Create admin user
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: "admin",
        profile: {
          create: {
            firstName: name,
            bio: number ? `Phone: ${number}` : null, // safe without schema change
          },
        },
      },
    });

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      defaultPassword, // show once or send by email later
    };
  },

  // =========================
  // GET ADMIN LIST (ONLY ADMINS)
  // =========================
  getAdminList: async (prisma, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [admins, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: "admin", // 🔑 ONLY ADMINS
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          profile: {
            select: {
              bio: true, // using bio to store phone temporarily
            },
          },
        },
      }),

      prisma.user.count({
        where: {
          role: "admin", // 🔑 ONLY ADMINS
        },
      }),
    ]);

    const formattedAdmins = admins.map((admin, index) => ({
      no: skip + index + 1,
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.profile?.bio
        ? admin.profile.bio.replace("Phone: ", "")
        : "N/A",
    }));

    return {
      meta: {
        total,
        page,
        limit,
      },
      admins: formattedAdmins,
    };
  },
};
