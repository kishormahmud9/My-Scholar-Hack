import bcrypt from "bcrypt";
import { success } from "zod";

export const AdminService = {
  getUserInfo: async (prisma, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: "STUDENT", // ✅ FIXED (enum)
          isDeleted: false, // ✅ IMPORTANT
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          profile: {
            select: {
              fullName: true, // ✅ FIXED (schema field)
            },
          },
          essays: {
            select: { id: true },
          },
          subscriptions: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: {
              plan: {
                select: {
                  name: true, // ✅ FIXED (schema field)
                },
              },
            },
          },
        },
      }),

      prisma.user.count({
        where: {
          role: "STUDENT", // ✅ FIXED
          isDeleted: false,
        },
      }),
    ]);

    const formattedUsers = users.map((user, index) => {
      const latestSubscription = user.subscriptions[0];

      return {
        no: skip + index + 1,
        id: user.id,
        name: user.profile?.fullName || user.name,
        email: user.email,
        totalEssays: user.essays.length,
        subscriptionPlan: latestSubscription?.plan?.name || "Free",
        status: latestSubscription ? "ACTIVE" : "INACTIVE",
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
  // UPDATE USER STATUS (SAFE)
  // =========================
  updateUserStatus: async (prisma, userId, status) => {
    const allowedStatus = ["ACTIVE", "INACTIVE"];

    // 1️⃣ Validate status
    if (!allowedStatus.includes(status)) {
      return {
        success: false,
        status: 400,
        message: "Invalid status. Allowed: ACTIVE, INACTIVE",
      };
    }

    // 2️⃣ Check user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.isDeleted) {
      return {
        success: false,
        status: 404,
        message: "User not found",
      };
    }

    // 3️⃣ Get latest subscription
    const latestSubscription = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // =========================
    // SET INACTIVE
    // =========================
    if (status === "INACTIVE") {
      if (!latestSubscription) {
        return {
          success: true,
          status: 200,
          message: "User is already inactive",
        };
      }

      await prisma.subscription.delete({
        where: { id: latestSubscription.id },
      });

      return {
        success: true,
        status: 200,
        message: "User deactivated successfully",
      };
    }

    // =========================
    // SET ACTIVE
    // =========================
    if (latestSubscription) {
      return {
        success: true,
        status: 200,
        message: "User is already active",
      };
    }

    // 4️⃣ Find cheapest active plan
    const plan = await prisma.plan.findFirst({
      where: { isActive: true },
      orderBy: { monthlyPrice: "asc" },
    });

    if (!plan) {
      return {
        success: false,
        status: 409,
        message: "No active plan exists. Please create a plan first.",
      };
    }

    await prisma.subscription.create({
      data: {
        status: "active", // enum value
        user: { connect: { id: userId } },
        plan: { connect: { id: plan.id } },
      },
    });

    return {
      success: true,
      status: 200,
      message: "User activated successfully",
    };
  },

  // =========================
  // DELETE USER (SOFT DELETE - SAFE)
  // =========================
  deleteUser: async (prisma, userId) => {
    // 1️⃣ Check user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.isDeleted) {
      return {
        success: false,
        status: 404,
        message: "User not found",
      };
    }

    // 2️⃣ Soft delete user
    await prisma.user.update({
      where: { id: userId },
      data: {
        isDeleted: true,
        status: "INACTIVE",
      },
    });

    // 3️⃣ Cleanup related active data (optional but good)
    await prisma.subscription.deleteMany({
      where: { userId },
    });

    return {
      success: true,
      status: 200,
      message: "User deleted successfully",
    };
  },

  // =========================
  // CREATE ADMIN (SAFE VERSION)
  // =========================
  createAdmin: async (prisma, data) => {
    const { name, email, number } = data;

    // 1️⃣ Required validation
    if (!email) {
      return {
        success: false,
        status: 400,
        message: "Email is required",
      };
    }

    // 2️⃣ Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        status: 409,
        message: "User with this email already exists",
      };
    }

    // 3️⃣ Fixed default password
    const defaultPassword = "admin@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // 4️⃣ Create admin
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: "ADMIN", // enum-safe
        profile: {
          create: {
            fullName: name || "Admin",
            bio: number ? `Phone: ${number}` : null,
          },
        },
      },
    });

    return {
      success: true,
      status: 201,
      message: "Admin created successfully",
      data: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        defaultPassword, // show once
      },
    };
  },

  // =========================
  // GET ADMIN LIST (SAFE)
  // =========================
  getAdminList: async (prisma, query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const [admins, total] = await Promise.all([
      prisma.user.findMany({
        where: {
          role: "ADMIN",
          isDeleted: false,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          profile: {
            select: {
              bio: true,
            },
          },
        },
      }),

      prisma.user.count({
        where: {
          role: "ADMIN",
          isDeleted: false,
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
      success: true,
      status: 200,
      message: "Admin list fetched successfully",
      data: {
        meta: {
          total,
          page,
          limit,
        },
        admins: formattedAdmins,
      },
    };
  },

  // =========================
  // DELETE ADMIN (SAFE)
  // =========================
  deleteAdmin: async (prisma, adminId, loggedInAdminId) => {
    // 1️⃣ Prevent self-delete
    if (adminId === loggedInAdminId) {
      return {
        success: false,
        status: 400,
        message: "You cannot delete your own admin account",
      };
    }

    // 2️⃣ Check target user exists and is admin
    const targetAdmin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!targetAdmin || targetAdmin.role !== "ADMIN") {
      return {
        success: false,
        status: 404,
        message: "Admin not found",
      };
    }

    // 3️⃣ Count total admins
    const adminCount = await prisma.user.count({
      where: { role: "ADMIN" },
    });

    // 4️⃣ Prevent deleting last admin
    if (adminCount <= 1) {
      return {
        success: false,
        status: 400,
        message: "Cannot delete the last remaining admin",
      };
    }

    // 5️⃣ Delete admin safely
    await prisma.$transaction([
      prisma.notification.deleteMany({ where: { userId: adminId } }),
      prisma.subscription.deleteMany({ where: { userId: adminId } }),
      prisma.application.deleteMany({ where: { userId: adminId } }),
      prisma.essay.deleteMany({ where: { userId: adminId } }),
      prisma.userProfile.deleteMany({ where: { userId: adminId } }),
      prisma.user.delete({ where: { id: adminId } }),
    ]);

    return {
      success: true,
      status: 200,
      message: "Admin deleted successfully",
    };
  },

  // =========================
  // UPDATE ADMIN (SAFE)
  // =========================
  updateAdmin: async (prisma, adminId, loggedInAdminId, data) => {
    const { name, email, number } = data;

    // 1️⃣ Prevent self edit
    if (adminId === loggedInAdminId) {
      return {
        success: false,
        status: 400,
        message: "You cannot edit your own admin account",
      };
    }

    // 2️⃣ Check admin exists
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      include: { profile: true },
    });

    if (!admin || admin.role !== "ADMIN") {
      return {
        success: false,
        status: 404,
        message: "Admin not found",
      };
    }

    // 3️⃣ Email uniqueness check
    if (email && email !== admin.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return {
          success: false,
          status: 409,
          message: "Email already in use",
        };
      }
    }

    // 4️⃣ Update admin + profile (schema-safe)
    const updatedAdmin = await prisma.user.update({
      where: { id: adminId },
      data: {
        name: name ?? admin.name,
        email: email ?? admin.email,
        profile: {
          upsert: {
            create: {
              fullName: name ?? admin.name,
              bio: number ? `Phone: ${number}` : null,
            },
            update: {
              fullName: name ?? admin.profile?.fullName ?? admin.name,
              bio: number ? `Phone: ${number}` : admin.profile?.bio,
            },
          },
        },
      },
    });

    return {
      success: true,
      status: 200,
      message: "Admin updated successfully",
      data: {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
      },
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
  // UPDATE PLAN (EDIT PLAN) — SAFE
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
      return {
        success: false,
        status: 404,
        message: "Plan not found",
      };
    }

    // 2️⃣ If name is changing, ensure uniqueness
    if (name && name !== plan.name) {
      const nameExists = await prisma.plan.findUnique({
        where: { name },
      });

      if (nameExists) {
        return {
          success: false,
          status: 400,
          message: "Plan name already exists",
        };
      }
    }

    // 3️⃣ Update plan
    const updatedPlan = await prisma.plan.update({
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

    return {
      success: true,
      status: 200,
      message: "Plan updated successfully",
      data: updatedPlan,
    };
  },

  // =========================
  // DELETE PLAN (SAFE)
  // =========================
  deletePlan: async (prisma, planId) => {
    // 1️⃣ Check plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: {
        subscriptions: true,
      },
    });

    if (!plan) {
      return {
        success: false,
        status: 404,
        message: "Plan not found",
      };
    }

    // 2️⃣ Prevent delete if plan is in use
    if (plan.subscriptions.length > 0) {
      return {
        success: false,
        status: 400,
        message:
          "Cannot delete plan. There are active subscriptions using this plan.",
      };
    }

    // 3️⃣ Delete plan
    await prisma.plan.delete({
      where: { id: planId },
    });

    return {
      success: true,
      status: 200,
      message: "Plan deleted successfully",
    };
  },

  // =========================
  // CREATE PLAN (SAFE)
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
      return {
        success: false,
        status: 400,
        message: "Name, monthlyPrice and yearlyPrice are required",
      };
    }

    // 2️⃣ Check unique plan name
    const existingPlan = await prisma.plan.findUnique({
      where: { name },
    });

    if (existingPlan) {
      return {
        success: false,
        status: 409,
        message: "Plan with this name already exists",
      };
    }

    // 3️⃣ Create plan
    const plan = await prisma.plan.create({
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

    return {
      success: true,
      status: 201,
      message: "Plan created successfully",
      data: plan,
    };
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
  // Create OFFERS (ADMIN)
  // =========================
  createOffer: async (prisma, data) => {
    const { title, description, ctaText, discountValue, startDate, endDate } =
      data;

    // 1️⃣ Required fields
    if (!title || discountValue == null || !startDate || !endDate) {
      return {
        success: false,
        status: 400,
        message: "title, discountValue, startDate, and endDate are required",
      };
    }

    // 2️⃣ Discount validation
    if (discountValue <= 0 || discountValue > 100) {
      return {
        success: false,
        status: 400,
        message: "discountValue must be between 1 and 100",
      };
    }

    // 3️⃣ Date validation
    if (new Date(startDate) >= new Date(endDate)) {
      return {
        success: false,
        status: 400,
        message: "Start date must be before end date",
      };
    }

    // 🔐 NO DUPLICATE TITLES (active or inactive)
    const existingOffer = await prisma.offer.findFirst({
      where: { title },
    });

    if (existingOffer) {
      return {
        success: false,
        status: 409,
        message: "Offer with this title already exists",
      };
    }

    // 🔥 ONLY ONE ACTIVE OFFER AT A TIME
    await prisma.offer.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    // 4️⃣ Create new ACTIVE offer
    const offer = await prisma.offer.create({
      data: {
        title,
        description,
        ctaText,
        discountType: "PERCENT",
        discountValue,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: true,
      },
    });

    return {
      success: true,
      status: 201,
      message: "Offer created and activated successfully",
      data: offer,
    };
  },

  // =========================
  // TOGGLE OFFER STATUS
  // =========================
  toggleOfferStatus: async (prisma, offerId) => {
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      return {
        success: false,
        status: 404,
        message: "Offer not found",
      };
    }

    // 🔥 If activating → deactivate all others
    if (!offer.isActive) {
      await prisma.offer.updateMany({
        where: {
          isActive: true,
          NOT: { id: offer.id },
        },
        data: { isActive: false },
      });
    }

    const updatedOffer = await prisma.offer.update({
      where: { id: offerId },
      data: {
        isActive: !offer.isActive,
      },
    });

    return {
      success: true,
      status: 200,
      message: "Offer status updated",
      data: updatedOffer,
    };
  },

  // =========================
  // DELETE OFFER
  // =========================
  deleteOffer: async (prisma, offerId) => {
    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      return {
        success: false,
        status: 404,
        message: "Offer not found",
      };
    }

    await prisma.offer.delete({
      where: { id: offerId },
    });

    return {
      success: true,
      status: 200,
      message: "Offer deleted successfully",
    };
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
      return {
        success: false,
        status: 404,
        message: "Offer not found",
      };
    }

    // 2️⃣ Title uniqueness (GLOBAL – no duplicates)
    if (title && title !== offer.title) {
      const existingTitle = await prisma.offer.findFirst({
        where: {
          title,
          NOT: { id: offerId },
        },
      });

      if (existingTitle) {
        return {
          success: false,
          status: 409,
          message: "Offer with this title already exists",
        };
      }
    }

    // 3️⃣ Discount validation
    if (discountValue !== undefined) {
      if (discountValue <= 0 || discountValue > 100) {
        return {
          success: false,
          status: 400,
          message: "discountValue must be between 1 and 100",
        };
      }
    }

    // 4️⃣ Date validation
    if (startDate && endDate) {
      if (new Date(startDate) >= new Date(endDate)) {
        return {
          success: false,
          status: 400,
          message: "Start date must be before end date",
        };
      }
    }

    // 5️⃣ SINGLE ACTIVE OFFER RULE
    if (isActive === true && offer.isActive === false) {
      // deactivate all other offers
      await prisma.offer.updateMany({
        where: {
          isActive: true,
          NOT: { id: offerId },
        },
        data: {
          isActive: false,
        },
      });
    }

    // 6️⃣ Update offer
    const updatedOffer = await prisma.offer.update({
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

    return {
      success: true,
      status: 200,
      message: "Offer updated successfully",
      data: updatedOffer,
    };
  },

  // =========================
  // CREATE FAQ
  // =========================
  createFaq: async (prisma, data) => {
    const { category, question, answer, sortOrder = 0 } = data;

    // 1️⃣ Validation
    if (!category || !question || !answer) {
      return {
        success: false,
        status: 400,
        message: "category, question, and answer are required",
      };
    }

    // 2️⃣ Create FAQ
    const faq = await prisma.faq.create({
      data: {
        category,
        question,
        answer,
        sortOrder,
        isActive: true,
      },
    });

    return {
      success: true,
      status: 201,
      message: "FAQ created successfully",
      data: faq,
    };
  },

  // =========================
  // UPDATE FAQ
  // =========================
  updateFaq: async (prisma, faqId, data) => {
    const { question, answer, sortOrder } = data;

    // 1️⃣ Check FAQ exists
    const faq = await prisma.faq.findUnique({
      where: { id: faqId },
    });

    if (!faq) {
      return {
        success: false,
        status: 404,
        message: "FAQ not found",
      };
    }

    // 2️⃣ Validation
    if (!question && !answer && sortOrder === undefined) {
      return {
        success: false,
        status: 400,
        message: "Nothing to update",
      };
    }

    // 3️⃣ Update FAQ
    const updatedFaq = await prisma.faq.update({
      where: { id: faqId },
      data: {
        question: question ?? faq.question,
        answer: answer ?? faq.answer,
        sortOrder: sortOrder !== undefined ? sortOrder : faq.sortOrder,
      },
    });

    return {
      success: true,
      status: 200,
      message: "FAQ updated successfully",
      data: updatedFaq,
    };
  },

  // =========================
  // DELETE FAQ
  // =========================
  deleteFaq: async (prisma, faqId) => {
    // 1️⃣ Check FAQ exists
    const faq = await prisma.faq.findUnique({
      where: { id: faqId },
    });

    if (!faq) {
      return {
        success: false,
        status: 404,
        message: "FAQ not found",
      };
    }

    // 2️⃣ Delete FAQ
    await prisma.faq.delete({
      where: { id: faqId },
    });

    return {
      success: true,
      status: 200,
      message: "FAQ deleted successfully",
    };
  },

  // =========================
  // GET ALL FAQ (ADMIN)
  // =========================
  getAllFaqs: async (prisma) => {
    return prisma.faq.findMany({
      orderBy: [
        { category: "asc" },
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
    });
  },

  // =========================
  // GET FAQ BY CATEGORY (ADMIN)
  // =========================
  getFaqsByCategory: async (prisma, category) => {
    // 1️⃣ Validation
    if (!category) {
      return {
        success: false,
        status: 400,
        message: "Category is required",
      };
    }

    // 2️⃣ Fetch FAQs
    const faqs = await prisma.faq.findMany({
      where: {
        category,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return {
      success: true,
      status: 200,
      data: faqs,
    };
  },
};
