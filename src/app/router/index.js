import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route.js";
import { ProfileRoutes } from "../modules/profiles/profile/profile.route.js";
import { AuthRouter } from "../modules/auth/auth.route.js";
import { OtpRouter } from "../modules/otp/otp.route.js";
import { AcademicInterestRoutes } from "../modules/profiles/academicInterest/academicInterest.route.js";
import { StudentIdentityRoutes } from "../modules/studentIdentity/studentIdentity.route.js";
import { EssayRoutes } from "../modules/essay/essay.route.js";
import { StudentActivityRoutes } from "../modules/studentActivity/studentActivity.route.js";
import { StudentWorkRoutes } from "../modules/studentWork/studentWork.route.js";
import { StudentVolunteerRoutes } from "../modules/studentVolunteer/studentVolunteer.route.js";
import { StudentAwardRoutes } from "../modules/studentAward/studentAward.route.js";
import { StudentChallengeRoutes } from "../modules/studentChallenge/studentChallenge.route.js";
import { ScholarshipInterestRoutes } from "../modules/scholarshipInterest/scholarshipInterest.route.js";
import { WritingPreferenceRoutes } from "../modules/writingPreference/writingPreference.route.js";

import { ExtracurricularActivityRoutes } from "../modules/profiles/extraCurricularActivities/extraCurricularActivities.route.js";
import { BasicInformationRoutes } from "../modules/profiles/basicInformation/basicInformation.route.js";
import { VolunteerRoutes } from "../modules/profiles/VolunteerWorkCommunityService/VolunteerWorkCommunityService.route.js";
import { AdminRoutes } from "../modules/admin/admin.route.js";
import { FamilyBackgroundRoutes } from "../modules/profiles/familyBackgroundCommunityService/familyBackground.route.js";
import { UniqueExperienceRoutes } from "../modules/profiles/uniqueExperience/uniqueExperience.route.js";
import { DiversityIdentityRoutes } from "../modules/profiles/diversityIdentity/diversityIdentity.route.js";
import { ScholarshipSpecificInfoRoutes } from "../modules/profiles/scholarshipSpecificInfo/scholarshipSpecificInfo.route.js";
import { AnythingElseRoutes } from "../modules/profiles/anythingElse/anythingElse.route.js";
import { EssaySpecificQuestionsRoutes } from "../modules/profiles/essaySpecificQuestions/essaySpecificQuestions.route.js";
import { EducationRoutes } from "../modules/profiles/education/education.route.js";
import { GenerateEssayRoutes } from "../modules/generateEssay/generateEssay.route.js";
import { EssayComparisonRoutes } from "../modules/essayComparison/essayComparison.route.js";
import { RecommendationRoutes } from "../modules/recommendation/recommendation.route.js";
import { ApplicationRoute } from "../modules/application/application.route.js";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/otp",
    route: OtpRouter,
  },
  {
    path: "/profile",
    route: ProfileRoutes,
  },
  {
    path: "/profile/basic-information",
    route: BasicInformationRoutes,
  },
  {
    path: "/profile/academic-interest",
    route: AcademicInterestRoutes,
  },
  {
    path: "/profile/extra-curricular-activities",
    route: ExtracurricularActivityRoutes,
  },
  {
    path: "/profile/volunteer-work",
    route: VolunteerRoutes,
  },
  {
    path: "/profile/family-background",
    route: FamilyBackgroundRoutes,
  },
  {
    path: "/profile/unique-experience",
    route: UniqueExperienceRoutes,
  },
  {
    path: "/profile/diversity-identity",
    route: DiversityIdentityRoutes,
  },
  {
    path: "/profile/scholarship-specific-info",
    route: ScholarshipSpecificInfoRoutes,
  },
  {
    path: "/profile/anything-else",
    route: AnythingElseRoutes,
  },
  {
    path: "/profile/essay-specific-questions",
    route: EssaySpecificQuestionsRoutes,
  },
    {
    path: "/profile/education",
    route: EducationRoutes,
  },
    {
    path: "/generate-essay",
    route: GenerateEssayRoutes,
  },
    {
    path: "/essay-comparison",
    route: EssayComparisonRoutes,
  },
    {
    path: "/essay-recommendation",
    route: RecommendationRoutes,
  },
    {
    path: "/application",
    route: ApplicationRoute,
  },

  // --------------
  {
    path: "/student-identity",
    route: StudentIdentityRoutes,
  },
  {
    path: "/essay",
    route: EssayRoutes,
  },
  {
    path: "/activity",
    route: StudentActivityRoutes,
  },
  {
    path: "/work",
    route: StudentWorkRoutes,
  },
  {
    path: "/volunteer",
    route: StudentVolunteerRoutes,
  },
  {
    path: "/award",
    route: StudentAwardRoutes,
  },
  {
    path: "/challenge",
    route: StudentChallengeRoutes,
  },
  {
    path: "/scholarship-interest",
    route: ScholarshipInterestRoutes,
  },

  {
    path: "/writing-preference",
    route: WritingPreferenceRoutes,
  },

  {
    path: "/admin",
    route: AdminRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
