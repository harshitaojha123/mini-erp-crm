import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware.js";
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getMe: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=authController.d.ts.map