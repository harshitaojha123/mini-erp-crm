import jwt from "jsonwebtoken";
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required",
            });
        }
        const token = authHeader.substring(7);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token required",
            });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not configured",
            });
        }
        const decoded = jwt.verify(token, secret);
        req.user = {
            id: decoded.id,
            role: decoded.role,
            email: decoded.email,
        };
        next();
    }
    catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
export default authMiddleware;
//# sourceMappingURL=authMiddleware.js.map