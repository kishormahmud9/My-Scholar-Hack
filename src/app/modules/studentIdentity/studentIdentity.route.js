import express from "express";

import { Role } from "../../utils/role.js";
import { StudentIdentityController } from "./studentIdentity.controller.js";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";

const router = express.Router();

router.post(
    "/",
    checkAuthMiddleware(...Object.values(Role)),
    StudentIdentityController.upsertStudentIdentity
);

router.get(
    "/:userProfileId",
    checkAuthMiddleware(...Object.values(Role)),
    StudentIdentityController.getStudentIdentity
);

export const StudentIdentityRoutes = router;
