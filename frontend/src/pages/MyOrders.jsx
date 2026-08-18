import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login to view your orders.");
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(
                    "http://localhost:5000/api/orders/my-orders",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setOrders(response.data);
            } catch (error) {
                console.error(error);

                alert(
                    error.response?.data?.message ||
                    "Failed to load orders."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    if (loading) {
        return (
            <div className="orders-page">
                <h2>Loading your orders...</h2>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <h1>My Orders</h1>

            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>You haven't placed any orders yet.</p>

                    <button
                        onClick={() => navigate("/")}
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div
                            className="order-card"
                            key={order.id}
                        >
                            <div>
                                <h3>
                                    Order #{order.id}
                                </h3>

                                <p>
                                    Total: ₹
                                    {Number(
                                        order.total_amount
                                    ).toFixed(2)}
                                </p>

                                <p>
                                    Date:{" "}
                                    {new Date(
                                        order.created_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <span
                                    className={`order-status ${order.status.toLowerCase()}`}
                                >
                                    {order.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button
                className="back-button"
                onClick={() => navigate("/")}
            >
                Back to Shop
            </button>
        </div>
    );
}

export default MyOrders;