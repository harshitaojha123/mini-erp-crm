import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  addFollowUp,
} from "../controllers/customerController.js";

const router = Router();

// All customer routes require authentication
router.use(authMiddleware);

// View customers - all roles
router.get("/", getCustomers);
router.get("/:id", getCustomerById);

// Create/update customers - Admin and Sales
router.post(
  "/",
  requireRole("ADMIN", "SALES"),
  createCustomer
);

router.put(
  "/:id",
  requireRole("ADMIN", "SALES"),
  updateCustomer
);

// Add follow-up - Admin and Sales
router.post(
  "/:id/follow-ups",
  requireRole("ADMIN", "SALES"),
  addFollowUp
);

export default router;