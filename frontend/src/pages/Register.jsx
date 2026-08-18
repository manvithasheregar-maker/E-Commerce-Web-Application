import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    name,
                    email,
                    password
                }
            );

            setMessage(response.data.message);

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleRegister}>
                <h2>Create Account</h2>

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit">
                    Register
                </button>

                {message && <p>{message}</p>}

                <p>
                    Already have an account?{" "}
                    <span
                        className="link"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Register;