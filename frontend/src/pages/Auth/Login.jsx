import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        console.log("CLICK WORKING");

        if (!email || !password) {
            alert("Enter email and password");
            return;
        }

        let role = "";

        if (email === "admin@gmail.com" && password === "admin123") {
            role = "admin";
        }

        else if (email === "merchant@gmail.com" && password === "merchant123") {
            role = "merchant";
        }

        else if (email === "user@gmail.com" && password === "user123") {
            role = "user";
        }

        else {
            alert("Invalid credentials");
            return;
        }

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", role);

        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "merchant") navigate("/merchant/profile");
        else navigate("/profile");
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
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full py-2 rounded cursor-pointer relative z-50"
                >
                    Login
                </button>

                <p
                    onClick={() => navigate("/forgot-password")}
                    className="text-center text-sm mt-3 text-blue-500 cursor-pointer"
                >
                    Forgot Password?
                </p>

                <p className="text-xs text-gray-500 mt-3 text-center">
                    admin@gmail.com / admin123 <br />
                    merchant@gmail.com / merchant123 <br />
                    user@gmail.com / user123
                </p>

            </div>
        </div>
    );
}

export default Login;