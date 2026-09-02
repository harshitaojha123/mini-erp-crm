import type { Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware.js";
export declare const createStockMovement: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getStockMovements: (_req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=stockController.d.ts.map