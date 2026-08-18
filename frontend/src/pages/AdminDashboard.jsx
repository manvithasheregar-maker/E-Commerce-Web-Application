import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

    const navigate = useNavigate();

    const [products, setProducts] =
        useState([]);

    const [orders, setOrders] =
        useState([]);

    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [price, setPrice] =
        useState("");

    const [image, setImage] =
        useState("");

    const [stock, setStock] =
        useState("");

    const [editingId, setEditingId] =
        useState(null);

    const token =
        localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // Check admin access
    useEffect(() => {

        if (
            !user ||
            user.role !== "admin"
        ) {
            alert(
                "Admin access required."
            );

            navigate("/");
        }

    }, [navigate]);

    // Fetch products
    const fetchProducts = async () => {

        try {

            const response =
                await axios.get(
                    "http://localhost:5000/api/products"
                );

            setProducts(
                response.data
            );

        } catch (error) {

            console.error(
                "Error fetching products:",
                error
            );

        }
    };

    // Fetch orders
    const fetchOrders = async () => {

        try {

            const response =
                await axios.get(
                    "http://localhost:5000/api/orders/all",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setOrders(
                response.data
            );

        } catch (error) {

            console.error(
                "Error fetching orders:",
                error
            );

            if (
                error.response?.status ===
                401
            ) {

                alert(
                    "Please login again."
                );

                navigate("/login");

            } else if (
                error.response?.status ===
                403
            ) {

                alert(
                    "You don't have admin access."
                );

                navigate("/");

            }

        }
    };

    useEffect(() => {

        if (
            user &&
            user.role === "admin"
        ) {

            fetchProducts();
            fetchOrders();

        }

    }, []);

    // Add product
    const addProduct = async (e) => {

        e.preventDefault();

        try {

            await axios.post(
                "http://localhost:5000/api/products",
                {
                    name,
                    description,
                    price,
                    image,
                    stock
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Product added successfully!"
            );

            clearForm();

            fetchProducts();

        } catch (error) {

            alert(
                error.response?.data
                    ?.message ||
                    "Failed to add product"
            );

        }
    };

    // Edit product
    const editProduct = (
        product
    ) => {

        setEditingId(
            product.id
        );

        setName(
            product.name
        );

        setDescription(
            product.description
        );

        setPrice(
            product.price
        );

        setImage(
            product.image || ""
        );

        setStock(
            product.stock
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Update product
    const updateProduct = async (
        e
    ) => {

        e.preventDefault();

        try {

            await axios.put(
                `http://localhost:5000/api/products/${editingId}`,
                {
                    name,
                    description,
                    price,
                    image,
                    stock
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Product updated successfully!"
            );

            clearForm();

            fetchProducts();

        } catch (error) {

            alert(
                error.response?.data
                    ?.message ||
                    "Failed to update product"
            );

        }
    };

    // Clear form
    const clearForm = () => {

        setEditingId(null);
        setName("");
        setDescription("");
        setPrice("");
        setImage("");
        setStock("");

    };

    // Delete product
    const deleteProduct = async (
        id
    ) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this product?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await axios.delete(
                `http://localhost:5000/api/products/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Product deleted successfully!"
            );

            fetchProducts();

        } catch (error) {

            alert(
                error.response?.data
                    ?.message ||
                    "Failed to delete product"
            );

        }
    };

    // Update order status
    const updateOrderStatus = async (
        orderId,
        newStatus
    ) => {

        try {

            await axios.put(
                `http://localhost:5000/api/orders/${orderId}/status`,
                {
                    status: newStatus
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            alert(
                "Order status updated successfully!"
            );

            fetchOrders();

        } catch (error) {

            alert(
                error.response?.data
                    ?.message ||
                    "Failed to update order status"
            );

        }
    };

    return (

        <div className="admin-dashboard">

            {/* HEADER */}

            <h1>
                Admin Dashboard
            </h1>

            <button
                onClick={() =>
                    navigate("/")
                }
            >
                Back to Shop
            </button>

            {/* ADD / EDIT PRODUCT */}

            <section>

                <h2>
                    {editingId
                        ? "Edit Product"
                        : "Add Product"}
                </h2>

                <form
                    className="admin-form"
                    onSubmit={
                        editingId
                            ? updateProduct
                            : addProduct
                    }
                >

                    <input
                        type="text"
                        placeholder="Product name"
                        value={name}
                        onChange={(e) =>
                            setName(
                                e.target.value
                            )
                        }
                        required
                    />

                    <textarea
                        placeholder="Product description"
                        value={
                            description
                        }
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        required
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) =>
                            setPrice(
                                e.target.value
                            )
                        }
                        required
                    />

                    <input
                        type="text"
                        placeholder="Image URL"
                        value={image}
                        onChange={(e) =>
                            setImage(
                                e.target.value
                            )
                        }
                    />

                    <input
                        type="number"
                        placeholder="Stock"
                        value={stock}
                        onChange={(e) =>
                            setStock(
                                e.target.value
                            )
                        }
                        required
                    />

                    <button type="submit">

                        {editingId
                            ? "Update Product"
                            : "Add Product"}

                    </button>

                    {editingId && (

                        <button
                            type="button"
                            onClick={
                                clearForm
                            }
                        >
                            Cancel Edit
                        </button>

                    )}

                </form>

            </section>

            {/* PRODUCTS */}

            <section>

                <h2>
                    Manage Products
                </h2>

                {products.length ===
                0 ? (

                    <p>
                        No products
                        available.
                    </p>

                ) : (

                    <div className="admin-products">

                        {products.map(
                            (product) => (

                                <div
                                    className="admin-product"
                                    key={
                                        product.id
                                    }
                                >

                                    <div>

                                        <h3>
                                            {
                                                product.name
                                            }
                                        </h3>

                                        <p>
                                            {
                                                product.description
                                            }
                                        </p>

                                        <p>
                                            Price:
                                            ₹
                                            {
                                                product.price
                                            }
                                        </p>

                                        <p>
                                            Stock:
                                            {
                                                product.stock
                                            }
                                        </p>

                                    </div>

                                    <div>

                                        <button
                                            onClick={() =>
                                                editProduct(
                                                    product
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteProduct(
                                                    product.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

            {/* CUSTOMER ORDERS */}

            <section
                className="admin-orders"
            >

                <h2>
                    Customer Orders
                </h2>

                {orders.length ===
                0 ? (

                    <p>
                        No orders found.
                    </p>

                ) : (

                    <div className="orders-list">

                        {orders.map(
                            (order) => (

                                <div
                                    className="admin-order-card"
                                    key={
                                        order.id
                                    }
                                >

                                    <div>

                                        <h3>
                                            Order #
                                            {
                                                order.id
                                            }
                                        </h3>

                                        <p>
                                            Customer:
                                            {
                                                order.user_name
                                            }
                                        </p>

                                        <p>
                                            Email:
                                            {
                                                order.email
                                            }
                                        </p>

                                        <p>
                                            Total:
                                            ₹
                                            {Number(
                                                order.total_amount
                                            ).toFixed(
                                                2
                                            )}
                                        </p>

                                        <p>
                                            Date:
                                            {" "}
                                            {new Date(
                                                order.created_at
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                    <div>

                                        <label>
                                            Order Status
                                        </label>

                                        <select
                                            value={
                                                order.status
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                updateOrderStatus(
                                                    order.id,
                                                    e
                                                        .target
                                                        .value
                                                )
                                            }
                                        >

                                            <option value="Pending">
                                                Pending
                                            </option>

                                            <option value="Processing">
                                                Processing
                                            </option>

                                            <option value="Shipped">
                                                Shipped
                                            </option>

                                            <option value="Delivered">
                                                Delivered
                                            </option>

                                            <option value="Cancelled">
                                                Cancelled
                                            </option>

                                        </select>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

        </div>
    );
}

export default AdminDashboard;