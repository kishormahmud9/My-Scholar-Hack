import express from "express";
import {
  loginUser,
  refreshToken,
  registerUser,
  userDetails,
} from "../controllers/userController.js";
import {
  academicInterest,
  addDiversity,
  addEssay,
  addExtraCurricularActivities,
  addFamilyBackground,
  addScholarshipSpecificInfo,
  addSpecificQuestions,
  addStudentAward,
  addStudentChallenge,
  addStudentWork,
  addUniqueExperiences,
  addVolunteerWork,
  createEducation,
  deleteEssay,
  deleteStudentAward,
  deleteStudentChallenge,
  deleteStudentWork,
  editEducation,
  editEssay,
  editStudentAward,
  editStudentChallenge,
  editStudentWork,
  updateProfileProgress,
  updateUser,
  upsertEssayNarrative,
  upsertUserProfile,
  upsertWritingPreference,
} from "../controllers/testController.js";

const globalRoutes = express.Router();

//🔗 Global Routes
globalRoutes.post("/register", registerUser);
globalRoutes.post("/login", loginUser);
globalRoutes.post("/refresh-token", refreshToken);

globalRoutes.get("/user-details/:id", userDetails);
globalRoutes.post("/update-user", updateUser);
globalRoutes.post("/upsert-user-profile", upsertUserProfile);
globalRoutes.post("/add-education", createEducation);
globalRoutes.post("/edit-education", editEducation);
globalRoutes.post("/upsert-academic-interest", academicInterest);
globalRoutes.post(
  "/add-extra-curricular-activities",
  addExtraCurricularActivities
);
globalRoutes.post("/add-volunteer-work", addVolunteerWork);
globalRoutes.post("/upsert-family-background", addFamilyBackground);
globalRoutes.post("/add-unique-experiences", addUniqueExperiences);
globalRoutes.post("/upsert-student-identity", addDiversity);
globalRoutes.post("/add-scholarship-specific-info", addScholarshipSpecificInfo);
globalRoutes.post("/add-specific-question", addSpecificQuestions);

globalRoutes.post("/add-work-experience", addStudentWork);
globalRoutes.post("/edit-work-experience", editStudentWork);
globalRoutes.post("/delete-work-experience", deleteStudentWork);

globalRoutes.post("/add-award", addStudentAward);
globalRoutes.post("/edit-award", editStudentAward);
globalRoutes.post("/delete-award", deleteStudentAward);

globalRoutes.post("/add-challenge", addStudentChallenge);
globalRoutes.post("/edit-challenge", editStudentChallenge);
globalRoutes.post("/delete-challenge", deleteStudentChallenge);

globalRoutes.post("/add-essay", addEssay);
globalRoutes.post("/edit-essay", editEssay);
globalRoutes.post("/delete-essay", deleteEssay);

globalRoutes.post("/upsert-essay-narrative", upsertEssayNarrative);

globalRoutes.post("/upsert-writing-preference", upsertWritingPreference);

globalRoutes.post("/update-profile-progress", updateProfileProgress);

export default globalRoutes;
