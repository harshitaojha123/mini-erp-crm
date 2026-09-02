import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware.js";
export declare const getProducts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProductById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createProduct: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateProduct: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=productController.d.ts.map