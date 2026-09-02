import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware.js";
export declare const getCustomers: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getCustomerById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const createCustomer: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateCustomer: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const addFollowUp: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=customerController.d.ts.map