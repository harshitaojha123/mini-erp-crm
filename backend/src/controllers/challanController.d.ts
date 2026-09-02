import type { Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware.js";
export declare const createChallan: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getChallans: (_req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const confirmChallan: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=challanController.d.ts.map