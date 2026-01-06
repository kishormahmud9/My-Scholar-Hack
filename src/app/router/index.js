import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route.js";
import { ProfileRoutes } from "../modules/profiles/profile/profile.route.js";
import { AuthRouter } from "../modules/auth/auth.route.js";
import { OtpRouter } from "../modules/otp/otp.route.js";
import { AcademicInterestRoutes } from "../modules/profiles/academicInterest/academicInterest.route.js";
import { FamilyBackgroundRoutes } from "../modules/profiles/familyBackground/familyBackground.route.js";
import { StudentIdentityRoutes } from "../modules/profiles/studentIdentity/studentIdentity.route.js";
import { EssayRoutes } from "../modules/essay/essay.route.js";
import { StudentActivityRoutes } from "../modules/profiles/studentActivity/studentActivity.route.js";
import { StudentWorkRoutes } from "../modules/profiles/studentWork/studentWork.route.js";
import { StudentVolunteerRoutes } from "../modules/profiles/studentVolunteer/studentVolunteer.route.js";
import { StudentAwardRoutes } from "../modules/profiles/studentAward/studentAward.route.js";
import { StudentChallengeRoutes } from "../modules/profiles/studentChallenge/studentChallenge.route.js";
import { ScholarshipInterestRoutes } from "../modules/profiles/scholarshipInterest/scholarshipInterest.route.js";
import { UniqueExperienceRoutes } from "../modules/profiles/uniqueExperience/uniqueExperience.route.js";
import { WritingPreferenceRoutes } from "../modules/profiles/writingPreference/writingPreference.route.js";
import { EducationRoutes } from "../modules/profiles/education/education.route.js";

import { ExtracurricularActivityRoutes } from "../modules/profiles/extraCurricularActivities/extraCurricularActivities.route.js";
import { BasicInformationRoutes } from "../modules/profiles/basicInformation/basicInformation.route.js";
import { VolunteerRoutes } from "../modules/profiles/VolunteerWorkCommunityService/VolunteerWorkCommunityService.route.js";
import { AdminRoutes } from "../modules/admin/admin.route.js";

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
    path: "/family-background",
    route: FamilyBackgroundRoutes,
  },
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
    path: "/unique-experience",
    route: UniqueExperienceRoutes,
  },
  {
    path: "/writing-preference",
    route: WritingPreferenceRoutes,
  },
  {
    path: "/education",
    route: EducationRoutes,
    path: "/admin",
    route: AdminRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
