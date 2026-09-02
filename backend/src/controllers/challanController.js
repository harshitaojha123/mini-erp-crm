import { z } from "zod";
import prisma from "../lib/prisma.js";
const challanSchema = z.object({
    customerId: z.number().int().positive(),
    items: z.array(z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
    })).min(1),
});
export const createChallan = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const data = challanSchema.parse(req.body);
        const customer = await prisma.customer.findUnique({
            where: { id: data.customerId },
        });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }
        const productIds = data.items.map((item) => item.productId);
        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
            },
        });
        if (products.length !== productIds.length) {
            return res.status(404).json({
                success: false,
                message: "One or more products not found",
            });
        }
        for (const item of data.items) {
            const product = products.find((p) => p.id === item.productId);
            if (!product)
                continue;
            if (product.currentStock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}. Available: ${product.currentStock}`,
                });
            }
        }
        const totalQuantity = data.items.reduce((sum, item) => sum + item.quantity, 0);
        const challanNumber = `CH-${Date.now()}`;
        const challan = await prisma.$transaction(async (tx) => {
            const created = await tx.challan.create({
                data: {
                    challanNumber,
                    customerId: data.customerId,
                    createdById: req.user.id,
                    totalQuantity,
                    status: "DRAFT",
                    items: {
                        create: data.items.map((item) => {
                            const product = products.find((p) => p.id === item.productId);
                            return {
                                productId: product.id,
                                quantity: item.quantity,
                                unitPrice: product.unitPrice,
                                productName: product.name,
                                sku: product.sku,
                            };
                        }),
                    },
                },
                include: {
                    items: true,
                    customer: true,
                },
            });
            return created;
        });
        return res.status(201).json({
            success: true,
            message: "Challan created successfully",
            data: challan,
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
        console.error("Create challan error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const getChallans = async (_req, res) => {
    try {
        const challans = await prisma.challan.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        businessName: true,
                        mobile: true,
                    },
                },
                items: true,
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                    },
                },
            },
        });
        return res.status(200).json({
            success: true,
            data: challans,
        });
    }
    catch (error) {
        console.error("Get challans error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export const confirmChallan = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const challanId = Number(req.params.id);
        if (!Number.isInteger(challanId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid challan ID",
            });
        }
        const result = await prisma.$transaction(async (tx) => {
            const challan = await tx.challan.findUnique({
                where: { id: challanId },
                include: {
                    items: true,
                },
            });
            if (!challan) {
                throw new Error("CHALLAN_NOT_FOUND");
            }
            if (challan.status !== "DRAFT") {
                throw new Error("CHALLAN_NOT_DRAFT");
            }
            // Check and reduce stock atomically
            for (const item of challan.items) {
                const updated = await tx.product.updateMany({
                    where: {
                        id: item.productId,
                        currentStock: {
                            gte: item.quantity,
                        },
                    },
                    data: {
                        currentStock: {
                            decrement: item.quantity,
                        },
                    },
                });
                if (updated.count === 0) {
                    throw new Error(`INSUFFICIENT_STOCK:${item.productName}`);
                }
                await tx.stockMovement.create({
                    data: {
                        productId: item.productId,
                        quantity: item.quantity,
                        type: "OUT",
                        reason: `Sales Challan ${challan.challanNumber}`,
                        createdById: req.user.id,
                    },
                });
            }
            return tx.challan.update({
                where: { id: challanId },
                data: {
                    status: "CONFIRMED",
                },
                include: {
                    customer: true,
                    items: true,
                },
            });
        });
        return res.status(200).json({
            success: true,
            message: "Challan confirmed and stock deducted successfully",
            data: result,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.message === "CHALLAN_NOT_FOUND") {
                return res.status(404).json({
                    success: false,
                    message: "Challan not found",
                });
            }
            if (error.message === "CHALLAN_NOT_DRAFT") {
                return res.status(400).json({
                    success: false,
                    message: "Only draft challans can be confirmed",
                });
            }
            if (error.message.startsWith("INSUFFICIENT_STOCK:")) {
                const productName = error.message.split(":")[1];
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${productName}`,
                });
            }
        }
        console.error("Confirm challan error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
//# sourceMappingURL=challanController.js.map