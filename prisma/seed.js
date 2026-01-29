import { PrismaClient, UserRole, AuthProviderType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ---------------------------
  // PASSWORDS
  // ---------------------------
  const studentPassword = await bcrypt.hash("student123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);

  // ---------------------------
  // VERIFIED STUDENT
  // ---------------------------
  const student = await prisma.user.upsert({
    where: { email: "student@test.com" },
    update: {},
    create: {
      email: "student@test.com",
      name: "Test Student",
      passwordHash: studentPassword,
      role: UserRole.STUDENT,
      status: "ACTIVE",
      isVerified: true,
      auths: {
        create: {
          provider: AuthProviderType.EMAIL,
        },
      },
      studentSettings: {
        create: {
          fullName: "Test Student",
        },
      },
      settings: {
        create: {},
      },
    },
  });

  // ---------------------------
  // VERIFIED ADMIN
  // ---------------------------
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      name: "System Admin",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      status: "ACTIVE",
      isVerified: true,
      auths: {
        create: {
          provider: AuthProviderType.EMAIL,
        },
      },
      settings: {
        create: {},
      },
    },
  });

  // ---------------------------
  // PLANS
  // ---------------------------
  const plans = [
    {
      name: "essay_hack_pro",
      description: "Best plan for serious scholarship applicants",
      features: [
        "AI “Voice” Matching",
        "Unlimited Revisions",
        "Application Trackers",
        "Deadline reminders",
        "Unlimited Essays/Month",
      ],
      monthlyPrice: 29.99,
      yearlyPrice: 359.88,
      isActive: true,
      sortOrder: 3,
    },
    {
      name: "essay_hack_plus",
      description: "Best plan for serious scholarship applicants",
      features: [
        "AI “Voice” Matching",
        "Unlimited Revisions",
        "Application Trackers",
        "Deadline reminders",
        "Unlimited Essays/Month",
      ],
      monthlyPrice: 19.99,
      yearlyPrice: 239.88,
      isActive: true,
      sortOrder: 2,
    },
    {
      name: "essay_hack",
      description: "Best plan for serious scholarship applicants",
      features: [
        "AI “Voice” Matching",
        "Unlimited Revisions",
        "Application Trackers",
        "Deadline reminders",
        "Unlimited Essays/Month",
      ],
      monthlyPrice: 9.99,
      yearlyPrice: 119.88,
      isActive: true,
      sortOrder: 1,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { name: plan.name },
      update: {
        description: plan.description,
        features: plan.features,
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice,
        isActive: plan.isActive,
        sortOrder: plan.sortOrder,
      },
      create: plan,
    });
  }

  console.log("✅ Seeding completed successfully!");
  console.log("👤 Student:", student.email);
  console.log("👮 Admin:", admin.email);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
