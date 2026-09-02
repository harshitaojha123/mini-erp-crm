import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { createChallan, getChallans, confirmChallan, } from "../controllers/challanController.js";
const router = Router();
router.use(authMiddleware);
router.get("/", getChallans);
router.post("/", requireRole("ADMIN", "SALES"), createChallan);
router.patch("/:id/confirm", requireRole("ADMIN", "SALES"), confirmChallan);
export default router;
//# sourceMappingURL=challanRoutes.js.map