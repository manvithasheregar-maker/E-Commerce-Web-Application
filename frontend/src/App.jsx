import { useEffect, useState } from "react";
import axios from "axios";
import {
    BrowserRouter,
    Routes,
    Route,
    Link
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import MyOrders from "./pages/MyOrders";

import "./App.css";

function Home() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/products"
            );

            setProducts(response.data);
        } catch (error) {
            console.error(
                "Error fetching products:",
                error
            );
        }
    };

    const addToCart = (product) => {
        setCart((currentCart) => {
            const existingProduct = currentCart.find(
                (item) => item.id === product.id
            );

            if (existingProduct) {
                return currentCart.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              quantity:
                                  item.quantity + 1
                          }
                        : item
                );
            }

            return [
                ...currentCart,
                {
                    ...product,
                    quantity: 1
                }
            ];
        });
    };

    const removeFromCart = (productId) => {
        setCart((currentCart) =>
            currentCart.filter(
                (item) => item.id !== productId
            )
        );
    };

    const increaseQuantity = (productId) => {
        setCart((currentCart) =>
            currentCart.map((item) =>
                item.id === productId
                    ? {
                          ...item,
                          quantity:
                              item.quantity + 1
                      }
                    : item
            )
        );
    };

    const decreaseQuantity = (productId) => {
        setCart((currentCart) =>
            currentCart
                .map((item) =>
                    item.id === productId
                        ? {
                              ...item,
                              quantity:
                                  item.quantity - 1
                          }
                        : item
                )
                .filter(
                    (item) => item.quantity > 0
                )
        );
    };

    const checkout = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert(
                "Please login before checkout."
            );
            return;
        }

        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        const totalAmount = cart.reduce(
            (total, item) =>
                total +
                Number(item.price) *
                    item.quantity,
            0
        );

        try {
            const response = await axios.post(
                "http://localhost:5000/api/orders",
                {
                    items: cart,
                    total_amount: totalAmount
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(
                `Order placed successfully! Order ID: ${response.data.orderId}`
            );

            setCart([]);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Checkout failed"
            );
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Logged out successfully!");

        window.location.href = "/login";
    };

    const totalPrice = cart.reduce(
        (total, item) =>
            total +
            Number(item.price) *
                item.quantity,
        0
    );

    const isLoggedIn =
        !!localStorage.getItem("token");

    return (
        <div className="app">

            {/* NAVBAR */}
            <nav className="navbar">

                <h1>ShopEasy</h1>

                <div className="nav-links">

                    <Link to="/">
                        Home
                    </Link>

                    <a href="#products">
                        Products
                    </a>

                    {isLoggedIn ? (
                        <button
                            onClick={logout}
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login">
                                Login
                            </Link>

                            <Link to="/register">
                                Register
                            </Link>
                        </>
                    )}

                    <Link to="/my-orders">
                        My Orders
                    </Link>

                    <Link to="/admin">
                        Admin
                    </Link>

                    <a href="#cart">
                        🛒 Cart ({cart.length})
                    </a>

                </div>

            </nav>

            {/* HERO */}
            <section className="hero">

                <h2>
                    Welcome to ShopEasy
                </h2>

                <p>
                    Find everything you need
                    in one place.
                </p>

                <a href="#products">
                    <button>
                        Shop Now
                    </button>
                </a>

            </section>

            {/* PRODUCTS */}
            <section
                className="products-section"
                id="products"
            >

                <h2>Our Products</h2>

                {products.length === 0 ? (
                    <p className="empty">
                        No products available yet.
                    </p>
                ) : (
                    <div className="product-grid">

                        {products.map(
                            (product) => (
                                <div
                                    className="product-card"
                                    key={
                                        product.id
                                    }
                                >

                                    <img
                                        src={
                                            product.image ||
                                            "https://via.placeholder.com/250"
                                        }
                                        alt={
                                            product.name
                                        }
                                    />

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

                                    <h4>
                                        ₹
                                        {
                                            product.price
                                        }
                                    </h4>

                                    <p>
                                        Stock:{" "}
                                        {
                                            product.stock
                                        }
                                    </p>

                                    <button
                                        onClick={() =>
                                            addToCart(
                                                product
                                            )
                                        }
                                        disabled={
                                            product.stock <=
                                            0
                                        }
                                    >
                                        {product.stock <=
                                        0
                                            ? "Out of Stock"
                                            : "Add to Cart"}
                                    </button>

                                </div>
                            )
                        )}

                    </div>
                )}

            </section>

            {/* CART */}
            <section
                className="cart-section"
                id="cart"
            >

                <h2>Your Cart</h2>

                {cart.length === 0 ? (
                    <p className="empty">
                        Your cart is empty.
                    </p>
                ) : (
                    <>
                        {cart.map((item) => (
                            <div
                                className="cart-item"
                                key={item.id}
                            >

                                <div>

                                    <h3>
                                        {item.name}
                                    </h3>

                                    <p>
                                        ₹
                                        {
                                            item.price
                                        }
                                    </p>

                                    <div className="quantity-controls">

                                        <button
                                            onClick={() =>
                                                decreaseQuantity(
                                                    item.id
                                                )
                                            }
                                        >
                                            -
                                        </button>

                                        <span>
                                            {
                                                item.quantity
                                            }
                                        </span>

                                        <button
                                            onClick={() =>
                                                increaseQuantity(
                                                    item.id
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>

                                <button
                                    onClick={() =>
                                        removeFromCart(
                                            item.id
                                        )
                                    }
                                >
                                    Remove
                                </button>

                            </div>
                        ))}

                        <h3 className="cart-total">
                            Total: ₹
                            {totalPrice.toFixed(
                                2
                            )}
                        </h3>

                        <button
                            className="checkout-button"
                            onClick={checkout}
                        >
                            Proceed to Checkout
                        </button>

                    </>
                )}

            </section>

        </div>
    );
}

function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/admin"
                    element={
                        <AdminDashboard />
                    }
                />

                <Route
                    path="/my-orders"
                    element={<MyOrders />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;