import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            alert("Enter email and password");
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:8080/api/auth/login",
                { email, password }
            );

            console.log(res.data);

            const token = res.data.data.token;
            const role = res.data.data.role.toLowerCase();

            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
            localStorage.setItem("isLoggedIn", "true");

            alert("Login successful");

            if (role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/profile");
            }

        } catch (err) {
            console.log(err);
            alert("Invalid credentials or server error");
        }
    };
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white shadow-lg rounded-xl p-8 w-80">

                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

                <input
                    type="email"
                    placeholder="Enter Email"
                    className="border p-2 mb-3 w-full rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    className="border p-2 mb-4 w-full rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded"
                >
                    Login
                </button>

                <p
                    onClick={() => navigate("/forgot-password")}
                    className="text-center text-sm mt-3 text-blue-500 cursor-pointer"
                >
                    Forgot Password?
                </p>

            </div>
        </div>
    );
}

export default Login;