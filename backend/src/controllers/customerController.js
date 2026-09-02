import { z } from "zod";
import prisma from "../lib/prisma.js";
const customerSchema = z.object({
    name: z.string().min(2, "Name is required"),
    mobile: z.string().min(10, "Valid mobile number is required"),
    email: z.string().email("Invalid email").optional(),
    businessName: z.string().min(2, "Business name is required"),
    gstNumber: z.string().optional(),
    type: z.enum(["RETAIL", "WHOLESALE", "DISTRIBUTOR"]),
    address: z.string().min(3, "Address is required"),
    status: z.enum(["LEAD", "ACTIVE", "INACTIVE"]).default("LEAD"),
    followUpDate: z.coerce.date().optional(),
    notes: z.string().optional(),
});
const updateCustomerSchema = customerSchema.partial();
const followUpSchema = z.object({
    note: z.string().min(1, "Follow-up note is required"),
});
// GET /api/customers
export const getCustomers = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
        const search = String(req.query.search || "").trim();
        const status = req.query.status;
        const type = req.query.type;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { mobile: { contains: search } },
                { businessName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
            ];
        }
        if (status) {
            where.status = status;
        }
        if (type) {
            where.type = type;
        }
        const [customers, total] = await Promise.all([
            prisma.customer.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.customer.count({ where }),
        ]);
        return res.status(200).json({
            success: true,
            data: customers,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        console.error("Get customers error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
// GET /api/customers/:id
export const getCustomerById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
            });
        }
        const customer = await prisma.customer.findUnique({
            where: { id },
            include: {
                followUps: {
                    orderBy: {
                        createdAt: "desc",
                    },
                    include: {
                        createdBy: {
                            select: {
                                id: true,
                                name: true,
                                role: true,
                            },
                        },
                    },
                },
            },
        });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }
        return res.status(200).json({
            success: true,
            data: customer,
        });
    }
    catch (error) {
        console.error("Get customer error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
// POST /api/customers
export const createCustomer = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const data = customerSchema.parse(req.body);
        const customer = await prisma.customer.create({
            data: {
                name: data.name,
                mobile: data.mobile,
                email: data.email ?? null,
                businessName: data.businessName,
                gstNumber: data.gstNumber ?? null,
                type: data.type,
                address: data.address,
                status: data.status,
                followUpDate: data.followUpDate ?? null,
                notes: data.notes ?? null,
                createdById: req.user.id,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: customer,
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.flatten().fieldErrors,
            });
        }
        console.error("Create customer error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
// PUT /api/customers/:id
export const updateCustomer = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
            });
        }
        const data = updateCustomerSchema.parse(req.body);
        const existingCustomer = await prisma.customer.findUnique({
            where: { id },
        });
        if (!existingCustomer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }
        const customer = await prisma.customer.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.mobile !== undefined && { mobile: data.mobile }),
                ...(data.email !== undefined && { email: data.email }),
                ...(data.businessName !== undefined && {
                    businessName: data.businessName,
                }),
                ...(data.gstNumber !== undefined && {
                    gstNumber: data.gstNumber,
                }),
                ...(data.type !== undefined && { type: data.type }),
                ...(data.address !== undefined && { address: data.address }),
                ...(data.status !== undefined && { status: data.status }),
                ...(data.followUpDate !== undefined && {
                    followUpDate: data.followUpDate,
                }),
                ...(data.notes !== undefined && { notes: data.notes }),
            },
        });
        return res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            data: customer,
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.flatten().fieldErrors,
            });
        }
        console.error("Update customer error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
// POST /api/customers/:id/follow-ups
export const addFollowUp = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const customerId = Number(req.params.id);
        if (!Number.isInteger(customerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
            });
        }
        const { note } = followUpSchema.parse(req.body);
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
        });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }
        const followUp = await prisma.followUp.create({
            data: {
                note,
                customerId,
                createdById: req.user.id,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Follow-up added successfully",
            data: followUp,
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.flatten().fieldErrors,
            });
        }
        console.error("Add follow-up error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
//# sourceMappingURL=customerController.js.map