import bcrypt from "bcrypt";
import crypto from "crypto";
import { name } from "ejs";

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
                select: { name: true },
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

  // =========================
  // DELETE ADMIN (SAFE)
  // =========================
  deleteAdmin: async (prisma, adminId, loggedInAdminId) => {
    // 1️⃣ Prevent self-delete
    if (adminId === loggedInAdminId) {
      throw new Error("You cannot delete your own admin account");
    }

    // 2️⃣ Check target user exists and is admin
    const targetAdmin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!targetAdmin || targetAdmin.role !== "admin") {
      throw new Error("Admin not found");
    }

    // 3️⃣ Count total admins
    const adminCount = await prisma.user.count({
      where: { role: "admin" },
    });

    // 4️⃣ Prevent deleting last admin
    if (adminCount <= 1) {
      throw new Error("Cannot delete the last admin");
    }

    // 5️⃣ Delete admin safely (clean related data)
    await prisma.$transaction([
      prisma.notification.deleteMany({ where: { userId: adminId } }),
      prisma.subscription.deleteMany({ where: { userId: adminId } }),
      prisma.application.deleteMany({ where: { userId: adminId } }),
      prisma.essay.deleteMany({ where: { userId: adminId } }),
      prisma.userProfile.deleteMany({ where: { userId: adminId } }),
      prisma.user.delete({ where: { id: adminId } }),
    ]);

    return { message: "Admin deleted successfully" };
  },

  // =========================
  // UPDATE ADMIN
  // =========================
  updateAdmin: async (prisma, adminId, loggedInAdminId, data) => {
    const { name, email, number } = data;

    // 1️⃣ Prevent self edit (optional but good)
    if (adminId === loggedInAdminId) {
      throw new Error("You cannot edit your own admin account");
    }

    // 2️⃣ Check admin exists
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      include: { profile: true },
    });

    if (!admin || admin.role !== "admin") {
      throw new Error("Admin not found");
    }

    // 3️⃣ Email uniqueness check
    if (email && email !== admin.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        throw new Error("Email already in use");
      }
    }

    // 4️⃣ Update admin + profile
    const updatedAdmin = await prisma.user.update({
      where: { id: adminId },
      data: {
        name: name ?? admin.name,
        email: email ?? admin.email,
        profile: {
          upsert: {
            create: {
              firstName: name ?? admin.name,
              bio: number ? `Phone: ${number}` : null,
            },
            update: {
              firstName: name ?? admin.name,
              bio: number ? `Phone: ${number}` : admin.profile?.bio,
            },
          },
        },
      },
    });

    return {
      id: updatedAdmin.id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
    };
  },

  // =========================
  // GET ALL PLANS (ADMIN)
  // =========================
  getAllPlans: async (prisma) => {
    return prisma.plan.findMany({
      orderBy: {
        sortOrder: "asc",
      },
    });
  },

  // =========================
  // TOGGLE PLAN ACTIVE / INACTIVE
  // =========================
  togglePlanStatus: async (prisma, planId) => {
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new Error("Plan not found");
    }

    const updatedPlan = await prisma.plan.update({
      where: { id: planId },
      data: {
        isActive: !plan.isActive,
      },
    });

    return updatedPlan;
  },

  // =========================
  // UPDATE PLAN (EDIT PLAN)
  // =========================
  updatePlan: async (prisma, planId, data) => {
    const {
      name,
      description,
      monthlyPrice,
      yearlyPrice,
      features,
      sortOrder,
    } = data;

    // 1️⃣ Check plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new Error("Plan not found");
    }

    // 2️⃣ If name is changing, ensure uniqueness
    if (name && name !== plan.name) {
      const nameExists = await prisma.plan.findUnique({
        where: { name },
      });

      if (nameExists) {
        throw new Error("Plan name already exists");
      }
    }

    // 3️⃣ Update plan
    return prisma.plan.update({
      where: { id: planId },
      data: {
        name: name ?? plan.name,
        description: description ?? plan.description,
        monthlyPrice: monthlyPrice ?? plan.monthlyPrice,
        yearlyPrice: yearlyPrice ?? plan.yearlyPrice,
        features: Array.isArray(features) ? features : plan.features,
        sortOrder: sortOrder ?? plan.sortOrder,
      },
    });
  },

  // =========================
  // DELETE PLAN (SAFE)
  // =========================
  deletePlan: async (prisma, planId) => {
    //  Check plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: {
        subscriptions: true,
      },
    });

    if (!plan) {
      throw new Error("Plan not found");
    }

    // Prevent delete if plan is in use
    if (plan.subscriptions.length > 0) {
      throw new Error(
        "Cannot delete plan. There are active subscriptions using this plan."
      );
    }

    // Delete plan
    await prisma.plan.delete({
      where: { id: planId },
    });

    return { message: "Plan deleted successfully" };
  },

  // =========================
  // CREATE PLAN
  // =========================
  createPlan: async (prisma, data) => {
    const {
      name,
      description,
      features,
      monthlyPrice,
      yearlyPrice,
      isActive = true,
      sortOrder = 0,
    } = data;

    // 1️⃣ Validate required fields
    if (!name || monthlyPrice == null || yearlyPrice == null) {
      throw new Error("Name, monthlyPrice and yearlyPrice are required");
    }

    // 2️⃣ Check unique plan name
    const existingPlan = await prisma.plan.findUnique({
      where: { name },
    });

    if (existingPlan) {
      throw new Error("Plan with this name already exists");
    }

    // Create plan
    return prisma.plan.create({
      data: {
        name,
        description,
        features: Array.isArray(features) ? features : [],
        monthlyPrice,
        yearlyPrice,
        isActive,
        sortOrder,
      },
    });
  },

  // =========================
  // GET ALL OFFERS (ADMIN)
  // =========================
  getAllOffers: async (prisma) => {
    // 🔥 auto-expire first
    const now = new Date();

    await prisma.offer.updateMany({
      where: {
        isActive: true,
        endDate: {
          lt: now,
        },
      },
      data: {
        isActive: false,
      },
    });

    // then fetch offers
    return prisma.offer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  // =========================
  // CREATE OFFER
  // =========================
  createOffer: async (prisma, data) => {
    const { title, description, ctaText, discountValue, startDate, endDate } =
      data;

    // 🔐 Required field validation
    if (
      !title ||
      discountValue === undefined ||
      discountValue === null ||
      !startDate ||
      !endDate
    ) {
      throw new Error(
        "title, discountValue, startDate, and endDate are required"
      );
    }

    // 🔐 Discount validation
    if (discountValue <= 0 || discountValue > 100) {
      throw new Error("discountValue must be between 1 and 100");
    }

    // 🔐 Date validation
    if (new Date(startDate) >= new Date(endDate)) {
      throw new Error("Start date must be before end date");
    }

    return prisma.offer.create({
      data: {
        title,
        description,
        ctaText,

        // 🔒 Enforced by backend
        discountType: "PERCENT",
        discountValue,

        startDate: new Date(startDate),
        endDate: new Date(endDate),

        isActive: true,
      },
    });
  },

  // =========================
  // TOGGLE OFFER STATUS
  // =========================
  toggleOfferStatus: async (prisma, offerId) => {
    // 1️⃣ Find existing offer
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      throw new Error("Offer not found");
    }

    // 2️⃣ Toggle isActive
    return prisma.offer.update({
      where: { id: offerId },
      data: {
        isActive: !offer.isActive,
      },
    });
  },

  // =========================
  // DELETE OFFER
  // =========================
  deleteOffer: async (prisma, offerId) => {
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      throw new Error("Offer not found");
    }

    return prisma.offer.delete({
      where: { id: offerId },
    });
  },

  // =========================
  // UPDATE OFFER (EDIT)
  // =========================
  updateOffer: async (prisma, offerId, data) => {
    const {
      title,
      description,
      ctaText,
      discountValue,
      startDate,
      endDate,
      isActive,
    } = data;

    // 1️⃣ Check offer exists
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      throw new Error("Offer not found");
    }

    // 2️⃣ Validate discount (if provided)
    if (discountValue !== undefined) {
      if (discountValue <= 0 || discountValue > 100) {
        throw new Error("discountValue must be between 1 and 100");
      }
    }

    // 3️⃣ Validate dates (if both provided)
    if (startDate && endDate) {
      if (new Date(startDate) >= new Date(endDate)) {
        throw new Error("Start date must be before end date");
      }
    }

    // 4️⃣ Update offer
    return prisma.offer.update({
      where: { id: offerId },
      data: {
        title: title ?? offer.title,
        description: description ?? offer.description,
        ctaText: ctaText ?? offer.ctaText,
        discountValue:
          discountValue !== undefined ? discountValue : offer.discountValue,
        startDate: startDate ? new Date(startDate) : offer.startDate,
        endDate: endDate ? new Date(endDate) : offer.endDate,
        isActive: typeof isActive === "boolean" ? isActive : offer.isActive,
      },
    });
  },
};
