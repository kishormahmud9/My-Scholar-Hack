import express from "express";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";
import { Role } from "../../utils/role.js";
import { StudentChallengeController } from "./studentChallenge.controller.js";


const router = express.Router();

router.post(
    "/",
    checkAuthMiddleware(...Object.values(Role)),
    StudentChallengeController.createChallenge
);

router.get(
    "/:userProfileId",
    checkAuthMiddleware(...Object.values(Role)),
    StudentChallengeController.getChallenges
);

router.put(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    StudentChallengeController.updateChallenge
);

router.delete(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    StudentChallengeController.deleteChallenge
);

export const StudentChallengeRoutes = router;
