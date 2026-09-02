import type { Response, NextFunction } from "express";
import type { AuthRequest } from "./authMiddleware.js";
export declare const requireRole: (...allowedRoles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=roleMiddleware.d.ts.map