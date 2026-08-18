const express = require("express");
const router = express.Router();

const db = require("../config/db");
const {
    verifyToken,
    isAdmin
} = require("../middleware/authMiddleware");
// Create an order
router.post("/", verifyToken, (req, res) => {
    const { items, total_amount } = req.body;
    const user_id = req.user.id;

    if (!items || items.length === 0) {
        return res.status(400).json({
            message: "Cart is empty"
        });
    }

    const orderSql = `
        INSERT INTO orders (user_id, total_amount)
        VALUES (?, ?)
    `;

    db.query(
        orderSql,
        [user_id, total_amount],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to create order",
                    error: err.message
                });
            }

            const orderId = result.insertId;

            const itemValues = items.map((item) => [
                orderId,
                item.id,
                item.quantity,
                item.price
            ]);

            const itemSql = `
                INSERT INTO order_items
                (order_id, product_id, quantity, price)
                VALUES ?
            `;

            db.query(
                itemSql,
                [itemValues],
                (err) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Failed to save order items",
                            error: err.message
                        });
                    }

                    res.status(201).json({
                        message: "Order placed successfully",
                        orderId
                    });
                }
            );
        }
    );
});

// Get logged-in user's orders
router.get("/my-orders", verifyToken, (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT *
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch orders",
                error: err.message
            });
        }

        res.json(results);
    });
});
// Get all orders - Admin only
router.get("/all", verifyToken, isAdmin, (req, res) => {
    const sql = `
        SELECT
            orders.id,
            orders.user_id,
            users.name AS user_name,
            users.email,
            orders.total_amount,
            orders.status,
            orders.created_at
        FROM orders
        JOIN users
            ON orders.user_id = users.id
        ORDER BY orders.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to fetch orders",
                error: err.message
            });
        }

        res.json(results);
    });
});

// Update order status - Admin only
router.put("/:id/status", verifyToken, isAdmin, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid order status"
        });
    }

    const sql = `
        UPDATE orders
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Failed to update order status",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Order status updated successfully"
        });
    });
});
module.exports = router;