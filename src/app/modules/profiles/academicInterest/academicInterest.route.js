import express from "express";
import { AcademicInterestController } from "./academicInterest.controller.js";

import { Role } from "../../../utils/role.js";
import { checkAuth } from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/",
    checkAuth(...Object.values(Role)),
    AcademicInterestController.upsertAcademicInterest
);

router.get(
    "/:userProfileId",
    checkAuth(...Object.values(Role)),
    AcademicInterestController.getAcademicInterest
);

export const AcademicInterestRoutes = router;
