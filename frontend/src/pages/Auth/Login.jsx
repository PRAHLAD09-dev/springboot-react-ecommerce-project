import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

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
            const res = await API.post("/auth/login", {
                email,
                password
            });

            console.log("Login Response:", res.data);

            const userData = res.data.data;

            localStorage.setItem("token", userData.token);
            localStorage.setItem("role", userData.role.toLowerCase());
            localStorage.setItem("isLoggedIn", "true");

            localStorage.setItem("email", userData.email);

            alert("Login successful");

            if (userData.role.toLowerCase() === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/profile");
            }

        } catch (err) {
            console.log(err);

            if (err.response?.status === 401) {
                alert("Invalid credentials");
            } else {
                alert("Server error");
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-xl p-8 w-96">

                <h1 className="text-2xl font-bold mb-6 text-center">
                    Login
                </h1>

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