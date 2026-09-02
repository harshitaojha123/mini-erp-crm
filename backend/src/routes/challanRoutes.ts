import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import { requireRole } from "../middleware/roleMiddleware.js";

import {
  createChallan,
  getChallans,
  confirmChallan,
  cancelChallan,
} from "../controllers/challanController.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getChallans);

router.post(
  "/",
  requireRole("ADMIN", "SALES"),
  createChallan
);

router.patch(
  "/:id/confirm",
  requireRole("ADMIN", "SALES"),
  confirmChallan
);

router.patch(
  "/:id/cancel",
  requireRole("ADMIN", "SALES"),
  cancelChallan
);

export default router;