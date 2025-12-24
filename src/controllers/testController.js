// import { UserProfileModel } from "../models/UserProfileModel.js";

import { UserModel } from "../models/User.js";
import { UserProfileModel } from "../models/UserProfile.js";

export const getAllUsersWithProfile = async (req, res) => {
  try {
    const prisma = req.prisma;

    const users = await UserModel.findAllWithProfile(prisma);

    return res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("getAllUsersWithProfile error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const prisma = req.prisma;

    const { userId, ...data } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("updateUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
};

export const upsertUserProfile = async (req, res) => {
  try {
    const { userId, ...data } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    const profile = await UserProfileModel.upsertByUserId(
      req.prisma,
      userId,
      data
    );

    res.json({
      success: true,
      message: "User profile saved successfully",
      data: profile,
    });
  } catch (error) {
    console.error("upsertUserProfile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save user profile",
    });
  }
};

export const createEducation = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userProfileId, institutionName, level, startYear, endYear } =
      req.body;

    const education = await prisma.education.create({
      data: {
        userProfileId,
        institutionName,
        level,
        startYear,
        endYear,
      },
    });

    return res.json({
      success: true,
      message: "Education added successfully",
      data: education,
    });
  } catch (error) {
    console.error("createEducation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add education",
    });
  }
};

export const editEducation = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { id, ...data } = req.body;

    const updatedEducation = await prisma.education.update({
      where: { id },
      data,
    });

    return res.json({
      success: true,
      message: "Education updated successfully",
      data: updatedEducation,
    });
  } catch (error) {
    console.error("editEducation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update education",
    });
  }
};

export const academicInterest = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userProfileId, intendedMajor, whyThisField, careerGoals } =
      req.body;

    const result = await prisma.academicInterest.upsert({
      where: { userProfileId },
      update: {
        intendedMajor,
        whyThisField,
        careerGoals,
      },
      create: {
        userProfileId,
        intendedMajor,
        whyThisField,
        careerGoals,
      },
    });

    return res.json({
      success: true,
      message: "Academic interest saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("academicInterest error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save academic interest",
    });
  }
};

export const addExtraCurricularActivities = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userProfileId, activityName, role, impact } = req.body;

    const activity = await prisma.studentActivity.create({
      data: {
        userProfileId,
        activityName,
        role,
        impact,
      },
    });

    return res.json({
      success: true,
      message: "Activity added successfully",
      data: activity,
    });
  } catch (error) {
    console.error("addExtraCurricularActivities error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add activity",
    });
  }
};

export const addVolunteerWork = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userProfileId, organization, timeline } = req.body;

    const volunteer = await prisma.studentVolunteer.create({
      data: {
        userProfileId,
        organization,
        timeline,
      },
    });

    return res.json({
      success: true,
      message: "Volunteer work added successfully",
      data: volunteer,
    });
  } catch (error) {
    console.error("addVolunteerWork error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add volunteer work",
    });
  }
};

export const addFamilyBackground = async (req, res) => {
  try {
    const prisma = req.prisma;
    const {
      userProfileId,
      firstGenStatus,
      householdIncomeRange,
      householdSize,
      familySituations,
    } = req.body;

    const result = await prisma.familyBackground.upsert({
      where: { userProfileId },
      update: {
        firstGenStatus,
        householdIncomeRange,
        householdSize,
        familySituations,
      },
      create: {
        userProfileId,
        firstGenStatus,
        householdIncomeRange,
        householdSize,
        familySituations,
      },
    });

    return res.json({
      success: true,
      message: "Family background saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("addFamilyBackground error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save family background",
    });
  }
};

export const addUniqueExperiences = async (req, res) => {
  try {
    const prisma = req.prisma;
    const {
      userProfileId,
      hobbies,
      uniqueExperiences,
      proudMoment,
      additionalNotes,
    } = req.body;

    const result = await prisma.uniqueExperience.upsert({
      where: { userProfileId },
      update: {
        hobbies,
        uniqueExperiences,
        proudMoment,
        additionalNotes,
      },
      create: {
        userProfileId,
        hobbies,
        uniqueExperiences,
        proudMoment,
        additionalNotes,
      },
    });

    return res.json({
      success: true,
      message: "Unique experiences saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("addUniqueExperiences error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save unique experiences",
    });
  }
};

export const addDiversity = async (req, res) => {
  try {
    const prisma = req.prisma;
    const {
      userProfileId,
      raceEthnicity,
      genderIdentity,
      otherIdentityFactors,
      religionOrCulture,
    } = req.body;

    const result = await prisma.studentIdentity.upsert({
      where: { userProfileId },
      update: {
        raceEthnicity,
        genderIdentity,
        otherIdentityFactors,
        religionOrCulture,
      },
      create: {
        userProfileId,
        raceEthnicity,
        genderIdentity,
        otherIdentityFactors,
        religionOrCulture,
      },
    });

    return res.json({
      success: true,
      message: "Student identity saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("addDiversity error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save student identity",
    });
  }
};

export const addScholarshipSpecificInfo = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userProfileId, interestTypes, deadlineTimeline } = req.body;

    const result = await prisma.studentScholarshipInterest.upsert({
      where: { userProfileId },
      update: {
        interestTypes,
        deadlineTimeline,
      },
      create: {
        userProfileId,
        interestTypes,
        deadlineTimeline,
      },
    });

    return res.json({
      success: true,
      message: "Scholarship preferences saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("addScholarshipSpecificInfo error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save scholarship preferences",
    });
  }
};

export const addSpecificQuestions = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userProfileId, question, answer } = req.body;

    const essay = await prisma.essay.create({
      data: {
        userProfileId,
        question,
        answer,
      },
    });

    return res.json({
      success: true,
      message: "Specific question added successfully",
      data: essay,
    });
  } catch (error) {
    console.error("addSpecificQuestions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add specific question",
    });
  }
};

export const addStudentWork = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userProfileId, jobTitle, employer, isCurrent } = req.body;

    const work = await prisma.studentWork.create({
      data: {
        userProfileId,
        jobTitle,
        employer,
        isCurrent,
      },
    });

    return res.json({
      success: true,
      message: "Work experience added successfully",
      data: work,
    });
  } catch (error) {
    console.error("addStudentWork error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add work experience",
    });
  }
};

export const editStudentWork = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { id, ...data } = req.body;

    const updatedWork = await prisma.studentWork.update({
      where: { id },
      data,
    });

    return res.json({
      success: true,
      message: "Work experience updated successfully",
      data: updatedWork,
    });
  } catch (error) {
    console.error("editStudentWork error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update work experience",
    });
  }
};

export const deleteStudentWork = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { id } = req.body;

    await prisma.studentWork.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: "Work experience deleted successfully",
    });
  } catch (error) {
    console.error("deleteStudentWork error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete work experience",
    });
  }
};

export const addStudentAward = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userProfileId, awardName, reason } = req.body;

    const award = await prisma.studentAward.create({
      data: {
        userProfileId,
        awardName,
        reason,
      },
    });

    return res.json({
      success: true,
      message: "Award added successfully",
      data: award,
    });
  } catch (error) {
    console.error("addStudentAward error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add award",
    });
  }
};

export const editStudentAward = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { id, ...data } = req.body;

    const updatedAward = await prisma.studentAward.update({
      where: { id },
      data,
    });

    return res.json({
      success: true,
      message: "Award updated successfully",
      data: updatedAward,
    });
  } catch (error) {
    console.error("editStudentAward error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update award",
    });
  }
};

export const deleteStudentAward = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { id } = req.body;

    await prisma.studentAward.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: "Award deleted successfully",
    });
  } catch (error) {
    console.error("deleteStudentAward error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete award",
    });
  }
};

export const addStudentChallenge = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userProfileId, challengeType, description } = req.body;

    const challenge = await prisma.studentChallenge.create({
      data: {
        userProfileId,
        challengeType,
        description,
      },
    });

    return res.json({
      success: true,
      message: "Challenge added successfully",
      data: challenge,
    });
  } catch (error) {
    console.error("addStudentChallenge error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add challenge",
    });
  }
};

export const editStudentChallenge = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { id, ...data } = req.body;

    const updatedChallenge = await prisma.studentChallenge.update({
      where: { id },
      data,
    });

    return res.json({
      success: true,
      message: "Challenge updated successfully",
      data: updatedChallenge,
    });
  } catch (error) {
    console.error("editStudentChallenge error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update challenge",
    });
  }
};

export const deleteStudentChallenge = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { id } = req.body;

    await prisma.studentChallenge.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: "Challenge deleted successfully",
    });
  } catch (error) {
    console.error("deleteStudentChallenge error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete challenge",
    });
  }
};

export const addEssay = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userProfileId, title, question, answer } = req.body;

    const essay = await prisma.essay.create({
      data: {
        userProfileId,
        title,
        question,
        answer,
      },
    });

    return res.json({
      success: true,
      message: "Essay added successfully",
      data: essay,
    });
  } catch (error) {
    console.error("addEssay error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add essay",
    });
  }
};

export const editEssay = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { id, ...data } = req.body;

    const updatedEssay = await prisma.essay.update({
      where: { id },
      data,
    });

    return res.json({
      success: true,
      message: "Essay updated successfully",
      data: updatedEssay,
    });
  } catch (error) {
    console.error("editEssay error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update essay",
    });
  }
};

export const deleteEssay = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { id } = req.body;

    await prisma.essay.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: "Essay deleted successfully",
    });
  } catch (error) {
    console.error("deleteEssay error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete essay",
    });
  }
};

export const upsertEssayNarrative = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userProfileId, ...data } = req.body;

    const result = await prisma.essayNarrative.upsert({
      where: { userProfileId },
      update: data,
      create: {
        userProfileId,
        ...data,
      },
    });

    return res.json({
      success: true,
      message: "Essay narrative saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("upsertEssayNarrative error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save essay narrative",
    });
  }
};

export const upsertWritingPreference = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userProfileId, ...data } = req.body;

    const result = await prisma.writingPreference.upsert({
      where: { userProfileId },
      update: data,
      create: {
        userProfileId,
        ...data,
      },
    });

    return res.json({
      success: true,
      message: "Writing preference saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("upsertWritingPreference error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save writing preference",
    });
  }
};

export const updateProfileProgress = async (req, res) => {
  try {
    const prisma = req.prisma;
    const { userProfileId, progressPercent, completedSections } = req.body;

    const result = await prisma.profileProgress.upsert({
      where: { userProfileId },
      update: {
        progressPercent,
        completedSections,
      },
      create: {
        userProfileId,
        progressPercent,
        completedSections,
      },
    });

    return res.json({
      success: true,
      message: "Profile progress updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("updateProfileProgress error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile progress",
    });
  }
};
