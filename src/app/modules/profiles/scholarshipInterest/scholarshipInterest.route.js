import express from "express";
import { ScholarshipInterestController } from "./scholarshipInterest.controller.js";
import { checkAuth } from "../../../middleware/authMiddleware.js";
import { Role } from "../../../utils/role.js";

const router = express.Router();

router.post(
    "/",
    checkAuth(...Object.values(Role)),
    ScholarshipInterestController.upsertScholarshipInterest
);

router.get(
    "/:userProfileId",
    checkAuth(...Object.values(Role)),
    ScholarshipInterestController.getScholarshipInterest
);

export const ScholarshipInterestRoutes = router;
