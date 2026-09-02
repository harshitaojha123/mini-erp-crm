import { Router } from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";

import {
  createStockMovement,
  getStockMovements,
} from "../controllers/stockController.js";

const router = Router();

router.use(authMiddleware);


router.get("/movements", getStockMovements);

 
router.post(
  "/movements",
  requireRole("ADMIN", "WAREHOUSE"),
  createStockMovement
);

export default router;