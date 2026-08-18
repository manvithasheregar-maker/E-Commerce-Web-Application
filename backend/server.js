const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = require("./config/db");

const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "E-Commerce API is running"
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
