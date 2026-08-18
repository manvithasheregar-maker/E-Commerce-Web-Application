const {
    verifyToken,
    isAdmin
} = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

const db = require("../config/db");

// Get all products
router.get("/", (req, res) => {
    const sql = "SELECT * FROM products";

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching products",
                error: err.message
            });
        }

        res.json(results);
    });
});

// Add a product
router.post("/", (req, res) => {
    const { name, description, price, image, stock } = req.body;

    const sql = `
        INSERT INTO products (name, description, price, image, stock)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, description, price, image, stock],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Error adding product",
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Product added successfully",
                productId: result.insertId
            });
        }
    );
});
// Delete product - Admin only
router.delete("/:id", verifyToken, isAdmin, (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM products WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error deleting product",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product deleted successfully"
        });
    });
});
// Update product - Admin only
router.put("/:id", verifyToken, isAdmin, (req, res) => {
    const { id } = req.params;

    const {
        name,
        description,
        price,
        image,
        stock
    } = req.body;

    const sql = `
        UPDATE products
        SET
            name = ?,
            description = ?,
            price = ?,
            image = ?,
            stock = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name,
            description,
            price,
            image,
            stock,
            id
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to update product",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            res.json({
                message:
                    "Product updated successfully"
            });
        }
    );
});
module.exports = router;