const jwt = require("jsonwebtoken");

const JWT_SECRET = "ecommerce_secret_key";

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access denied. No token provided."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Admin access required."
        });
    }

    next();
};

module.exports = {
    verifyToken,
    isAdmin
};