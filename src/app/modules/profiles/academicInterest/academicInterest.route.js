import express from "express";


import { Role } from "../../../utils/role.js";
import { AcademicInterestController } from "./academicInterest.controller.js";
import { checkAuthMiddleware } from "../../../middleware/checkAuthMiddleware.js";


const router = express.Router();

router.get(
  "/",
  checkAuthMiddleware(Role.STUDENT),
  AcademicInterestController.getAcademicInterest
);

router.post(
  "/create",
  checkAuthMiddleware(Role.STUDENT),
  AcademicInterestController.createAcademicInterest
);

router.put(
  "/update",
  checkAuthMiddleware(Role.STUDENT),
  AcademicInterestController.updateAcademicInterest
);

export const AcademicInterestRoutes = router;
