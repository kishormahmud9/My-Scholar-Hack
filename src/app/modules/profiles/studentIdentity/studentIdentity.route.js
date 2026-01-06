import express from "express";
import { StudentIdentityController } from "./studentIdentity.controller.js";
import { checkAuth } from "../../../middleware/authMiddleware.js";
import { Role } from "../../../utils/role.js";

const router = express.Router();

router.post(
    "/",
    checkAuth(...Object.values(Role)),
    StudentIdentityController.upsertStudentIdentity
);

router.get(
    "/:userProfileId",
    checkAuth(...Object.values(Role)),
    StudentIdentityController.getStudentIdentity
);

export const StudentIdentityRoutes = router;
