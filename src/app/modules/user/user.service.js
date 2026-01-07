import { envVars } from "../../config/env.js";
import DevBuildError from "../../lib/DevBuildError.js";
import bcrypt from "bcrypt";
// export const UserService = {
//   // create: async (prisma, data) => prisma.user.create({ data }),
//   findByEmail: async (prisma, email) =>
//     prisma.user.findUnique({ where: { email } }),
//   findByUsername: async (prisma, username) =>
//     prisma.user.findUnique({ where: { username } }),
//   findById: async (prisma, id) => prisma.user.findUnique({ where: { id } }),
//   findAll: async (prisma) =>
//     prisma.user.findMany({
//       include: { business: true },
//     }),
//   // ✅ Update user by ID
//   update: async (prisma, id, data) =>
//     prisma.user.update({
//       where: { id },
//       data,
//     }),

//   // ✅ Delete user by ID
//   delete: async (prisma, id) =>
//     prisma.user.delete({
//       where: { id },
//     }),

//   // ✅ User + Full Profile (ALL relations)
//   findByIdWithProfile: async (prisma, id) =>
//     prisma.user.findUnique({
//       where: { id },
//       include: {
//         profile: {
//           include: {
//             educations: true,
//             activities: true,
//             work: true,
//             volunteer: true,
//             awards: true,
//             challenges: true,
//             essays: true,
//             academicInterest: true,
//             scholarships: true,
//             progress: true,
//             familyBackground: true,
//             studentIdentity: true,
//             essayNarrative: true,
//             writingPreference: true,
//             uniqueExperience: true,
//           },
//         },
//       },
//     }),

//   findAllWithProfile: async (prisma) =>
//     prisma.user.findMany({
//       include: {
//         profile: {
//           include: {
//             educations: true,
//             activities: true,
//             work: true,
//             volunteer: true,
//             awards: true,
//             challenges: true,
//             essays: true,
//             academicInterest: true,
//             scholarships: true,
//             progress: true,
//             familyBackground: true,
//             studentIdentity: true,
//             essayNarrative: true,
//             writingPreference: true,
//             uniqueExperience: true,
//           },
//         },
//       },
//     }),
// };

export const UserService = {
  // ======================
  // BASIC FIND METHODS
  // ======================
  findByEmail: async (prisma, email) =>
    prisma.user.findUnique({ where: { email } }),

  findByUsername: async (prisma, username) =>
    prisma.user.findUnique({ where: { username } }),

  findById: async (prisma, id) =>
    prisma.user.findUnique({ where: { id } }),

  // ======================
  // ✅ ONLY USER INFO (NO PROFILE)
  // ======================
  findUserInfoById: async (prisma, id) =>
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        role: true,
        isVerified: true,
        status: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

  // ======================
  // UPDATE / DELETE
  // ======================
  update: async (prisma, id, data) =>
    prisma.user.update({
      where: { id },
      data,
    }),

  delete: async (prisma, id) =>
    prisma.user.delete({
      where: { id },
    }),

  // ======================
  // USER + FULL PROFILE
  // ======================
  findByIdWithProfile: async (prisma, id) =>
    prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            educations: true,
            activities: true,
            work: true,
            volunteer: true,
            awards: true,
            challenges: true,
            essays: true,
            academicInterest: true,
            scholarships: true,
            progress: true,
            familyBackground: true,
            studentIdentity: true,
            essaySpecificQuestions: true,
            writingPreference: true,
            uniqueExperience: true,
            basicInformation: true,
            extraCurricularsActivity: true,
            volunteerWork: true,
            diversityIdentity: true,
            scholarshipSpecificInfo: true,
            anythingElse: true,
          },
        },
      },
    }),

  findAllWithProfile: async (prisma) =>
    prisma.user.findMany({
      include: {
        profile: {
          include: {
            educations: true,
            activities: true,
            work: true,
            volunteer: true,
            awards: true,
            challenges: true,
            essays: true,
            academicInterest: true,
            scholarships: true,
            progress: true,
            familyBackground: true,
            studentIdentity: true,
            essaySpecificQuestions: true,
            writingPreference: true,
            uniqueExperience: true,
            basicInformation: true,
            extraCurricularsActivity: true,
            volunteerWork: true,
            diversityIdentity: true,
            scholarshipSpecificInfo: true,
            anythingElse: true,
          },
        },
      },
    }),
};


export const createUserService = async (payload) => {
  const { prisma, email, password, picture, ...rest } = payload;

  if (!email || !password) {
    throw new DevBuildError("Email and password are required", 400);
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new DevBuildError("User already exists", 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    password,
    Number(envVars.BCRYPT_SALT_ROUND || 10)
  );

  // Create user + auth provider in one transaction
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      picture,
      isVerified: false,
      role: "STUDENT",
      ...rest,

      auths: {
        create: {
          provider: "EMAIL",
          providerId: email,
        },
      },
    },
    include: {
      auths: true,
    },
  });

  return user;
};



