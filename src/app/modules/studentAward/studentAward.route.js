import express from "express";
import { checkAuthMiddleware } from "../../middleware/checkAuthMiddleware.js";
import { Role } from "../../utils/role.js";
import { StudentAwardController } from "./studentAward.controller.js";


const router = express.Router();

router.post(
    "/",
    checkAuthMiddleware(...Object.values(Role)),
    StudentAwardController.createAward
);

router.get(
    "/:userProfileId",
    checkAuthMiddleware(...Object.values(Role)),
    StudentAwardController.getAwards
);

router.put(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    StudentAwardController.updateAward
);

router.delete(
    "/:id",
    checkAuthMiddleware(...Object.values(Role)),
    StudentAwardController.deleteAward
);

export const StudentAwardRoutes = router;
