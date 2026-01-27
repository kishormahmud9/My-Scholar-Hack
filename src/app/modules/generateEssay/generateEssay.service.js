import axios from "axios";
import fs from "fs";
import path from "path";
import { envVars } from "../../config/env.js";
import { QueryBuilder } from "../../utils/QueryBuilder.js";
import {
  essaySearchableFields,
} from "./generateEssay.constant.js";

// src/constants/essayStatus.js
export const ESSAY_STATUS = {
  GENERATING: "GENERATING",
  SAVED: "SAVED",
  FAILED: "FAILED",
  EDITED: "EDITED",
};


export const EssayService = {

  // GET all essays by user
  getByUserId: async (prisma, userId, query) => {
    const builder = new QueryBuilder(query)
      .search([
        ...essaySearchableFields
      ])
      .filter({
        scholarship: ["type", "from"],
      })
      .sort("-createdAt", {
        scholarship: ["type", "from"],
      })
      .fields()
      .paginate();

    const prismaQuery = builder.build();

    // 🔥 ALWAYS exclude deleted essays
    prismaQuery.where = {
      ...(prismaQuery.where || {}),
      userId,
      isDeleted: false,
    };

    // Handle select/include conflict
    if (prismaQuery.select) {
      prismaQuery.select.scholarship = true;
    } else {
      prismaQuery.include = {
        scholarship: true,
      };
    }

    const data = await prisma.essay.findMany(prismaQuery);

    const total = await prisma.essay.count({
      where: prismaQuery.where,
    });

    return {
      data,
      meta: builder.getMeta(total),
    };
  },

  // GET single essay
  getById: async (prisma, id, userId) => {
    return prisma.essay.findFirst({
      where: {
        id,
        userId,
        isDeleted: false,
      },
    });
  },

  // CREATE prompt first
  createPrompt: async (prisma, data) => {
    return prisma.essay.create({
      data: {
        ...data,
        status: ESSAY_STATUS.GENERATING,
        voiceUrl: data.voiceUrl || null,
        documentUrls: data.documentUrls || [],
        voiceFilePath: data.voiceFilePath || null,
        documentFilePath: data.documentFilePath || [],
        isDeleted: false,
      },
    });
  },

  // UPDATE essay (AI or edit)
  updateEssay: async (prisma, id, userId, data) => {
    const essay = await prisma.essay.findFirst({
      where: {
        id,
        userId,
        isDeleted: false,
      },
    });

    if (!essay) {
      const error = new Error("Essay not found or not authorized");
      error.statusCode = 404;
      throw error;
    }

    return prisma.essay.update({
      where: { id },
      data,
    });
  },

  // UPDATE essay content (USER EDIT)
  updateEssayContent: async (prisma, id, userId, contentFinal) => {
    const result = await prisma.essay.updateMany({
      where: {
        id,
        userId,
        isDeleted: false,
      },
      data: {
        contentFinal,
        wordCount: contentFinal.trim().split(/\s+/).length,
        status: ESSAY_STATUS.EDITED,
        updatedAt: new Date(),
      },
    });

    if (result.count === 0) {
      const error = new Error("Essay not found or not authorized");
      error.statusCode = 404;
      throw error;
    }

    return result;
  },

  // SOFT DELETE essay
  delete: async (prisma, id, userId) => {
    const essay = await prisma.essay.findFirst({
      where: {
        id,
        userId,
        isDeleted: false,
      },
    });

    if (!essay) {
      const error = new Error("Essay not found or not authorized");
      error.statusCode = 404;
      throw error;
    }

    return prisma.essay.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  },

  // AI CALL (Updated Sig: prompt, audioPath, filePath)
  generateEssayByAI: async (prompt, voicePath = null, documentPath = null) => {
    try {
      console.log("🚀 Forwarding to AI Service...");
      console.log("- Prompt length:", prompt?.length || 0);

      const formData = new FormData();
      formData.append("prompt", prompt || "");

      // 1️⃣ Attach local voice file (if exists)
      if (voicePath && fs.existsSync(voicePath)) {
        console.log(`- Attaching local audio: ${voicePath}`);
        const fileContent = fs.readFileSync(voicePath);
        const fileName = path.basename(voicePath);
        const blob = new Blob([fileContent]);
        formData.append("audio", blob, fileName);
      } else if (voicePath) {
        console.warn(`⚠️ Local audio file not found at: ${voicePath}`);
      }

      // 2️⃣ Attach local document file (if exists)
      if (documentPath && fs.existsSync(documentPath)) {
        console.log(`- Attaching local file: ${documentPath}`);
        const fileContent = fs.readFileSync(documentPath);
        const fileName = path.basename(documentPath);
        const blob = new Blob([fileContent]);
        formData.append("file", blob, fileName);
      } else if (documentPath) {
        console.warn(`⚠️ Local document file not found at: ${documentPath}`);
      }

      console.log("📤 Sending POST request to AI Service at:", envVars.AI_SERVICE_URL);

      const response = await axios.post(envVars.AI_SERVICE_URL, formData);

      console.log("✅ AI Service Response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ AI Service Communication Error:");
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
      } else {
        console.error("Message:", error.message);
      }
      throw error;
    }
  },
  // 🛡️ VALIDATE profile completion
  validateProfileCompletion: async (prisma, userId) => {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      include: {
        basicInformation: true,
        academicInterest: true,
        education: true,
        extraCurricularsActivity: true,
        volunteerWork: true,
        familyBackground: true,
        uniqueExperience: true,
        diversityIdentity: true,
        scholarshipSpecificInfo: true,
        essaySpecificQuestions: true,
      },
    });

    if (!profile) {
      const error = new Error("Please complete your profile first.");
      error.statusCode = 400;
      throw error;
    }

    const sections = [
      { name: "Basic Information", data: profile.basicInformation },
      { name: "Academic Interest", data: profile.academicInterest },
      { name: "Education", data: profile.education },
      { name: "Extra Curriculars Activity", data: profile.extraCurricularsActivity },
      { name: "Volunteer Work", data: profile.volunteerWork },
      { name: "Family Background", data: profile.familyBackground },
      { name: "Unique Experience", data: profile.uniqueExperience },
      { name: "Diversity Identity", data: profile.diversityIdentity },
      { name: "Scholarship Specific Info", data: profile.scholarshipSpecificInfo },
      { name: "Essay Specific Questions", data: profile.essaySpecificQuestions },
    ];

    const missingSections = sections
      .filter((s) => !s.data)
      .map((s) => s.name);

    if (missingSections.length > 0) {
      const error = new Error(
        `Please complete the following profile sections: ${missingSections.join(", ")}`
      );
      error.statusCode = 400;
      throw error;
    }

    return profile;
  },
};

