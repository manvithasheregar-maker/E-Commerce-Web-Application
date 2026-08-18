const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const db = require("../config/db");

const JWT_SECRET = "ecommerce_secret_key";

// Register
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Please fill all fields"
        });
    }

    try {
        const checkUser = "SELECT * FROM users WHERE email = ?";

        db.query(checkUser, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    message: "Email already registered"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const sql = `
                INSERT INTO users (name, email, password, role)
                VALUES (?, ?, ?, 'user')
            `;

            db.query(
                sql,
                [name, email, hashedPassword],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Registration failed",
                            error: err.message
                        });
                    }

                    res.status(201).json({
                        message: "Registration successful"
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
});

// Login
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Please enter email and password"
        });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    });
});

module.exports = router;