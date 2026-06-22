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

            window.dispatchEvent(
                new Event("authChanged")
            );

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
        <div className="
                    min-h-screen
                    flex
                    justify-center
                    items-center
                    bg-gray-50
                    px-4
                ">
            <div className="
                w-full
                max-w-md
                bg-white
                shadow-xl
                rounded-2xl
                p-8
                    ">

                <h1 className="text-3xl font-bold text-center mb-2">
                    Welcome Back
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    Sign in to continue shopping
                </p>

                <input
                    type="email"
                    placeholder="Enter Email"
                    className="
                            w-full
                            border
                            rounded-xl
                            p-3
                            mb-4
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    className="
                            w-full
                            border
                            rounded-xl
                            p-3
                            mb-4
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="
                            w-full
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            py-3
                            rounded-xl
                            font-medium
                            transition
                        "
                >
                    Login
                </button>

                <p
                    onClick={() => navigate("/forgot-password")}
                    className="text-center text-sm mt-3 text-blue-500 cursor-pointer"
                >
                    Forgot Password?
                </p>

                <div className="flex items-center my-5">

                    <div className="flex-1 border-t"></div>

                    <span className="px-3 text-gray-500 text-sm">
                        OR
                    </span>

                    <div className="flex-1 border-t"></div>

                </div>
                <a
                    href="http://localhost:8080/oauth2/authorization/google"
                    className="
                        flex
                        items-center
                        justify-center
                        gap-3
                        border
                        rounded-xl
                        py-3
                        px-4
                        hover:bg-gray-50
                        transition
                        w-full
                    "
                >

                    <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="Google"
                        className="w-5 h-5"
                    />

                    Continue with Google

                </a>
                <div className="text-center mt-5">

                    <p className="text-gray-600">

                        Don't have an account?

                        <span
                            onClick={() => navigate("/signup")}
                            className="
                                text-blue-600
                                cursor-pointer
                                ml-1
                                font-medium
                            "
                        >
                            Sign Up
                        </span>

                    </p>

                </div>
            </div>

        </div>
    );
}

export default Login;