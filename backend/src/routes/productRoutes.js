import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import { getProducts, getProductById, createProduct, updateProduct, } from "../controllers/productController.js";
const router = Router();
router.use(authMiddleware);
// View products - all authenticated roles
router.get("/", getProducts);
router.get("/:id", getProductById);
// Create/update products - Admin and Warehouse
router.post("/", requireRole("ADMIN", "WAREHOUSE"), createProduct);
router.put("/:id", requireRole("ADMIN", "WAREHOUSE"), updateProduct);
export default router;
//# sourceMappingURL=productRoutes.js.map