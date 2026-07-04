import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ShoppingBag } from "lucide-react";
import API from "../../services/api";
import { Input, Button } from "../../components/ui";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState("");

    const validate = () => {
        const next = {};
        if (!email) next.email = "Email is required";
        if (!password) next.password = "Password is required";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setFormError("");
        if (!validate()) return;

        setLoading(true);
        try {
            const res = await API.post("/auth/login", { email, password });
            const userData = res.data.data;

            localStorage.setItem("token", userData.token);
            localStorage.setItem("role", userData.role.toLowerCase());
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("email", userData.email);

            window.dispatchEvent(new Event("authChanged"));

            if (userData.role.toLowerCase() === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/profile");
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setFormError("Invalid email or password.");
            } else {
                setFormError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-ink-50 px-4 py-12">
            <div className="w-full max-w-md animate-slide-up">
                <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md">
                        <ShoppingBag size={22} />
                    </div>
                    <h1 className="text-2xl font-bold text-ink-950">Welcome back</h1>
                    <p className="mt-1.5 text-sm text-ink-500">Sign in to continue shopping</p>
                </div>

                <form onSubmit={handleLogin} className="card-surface space-y-4 p-6 sm:p-8">
                    {formError && (
                        <div className="rounded-xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">
                            {formError}
                        </div>
                    )}

                    <Input
                        id="email"
                        label="Email"
                        type="email"
                        icon={Mail}
                        placeholder="you@example.com"
                        value={email}
                        error={errors.email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Input
                        id="password"
                        label="Password"
                        type="password"
                        icon={Lock}
                        placeholder="Enter your password"
                        value={password}
                        error={errors.password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex justify-end">
                        <Link to="/forgot-password" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" fullWidth size="lg" loading={loading}>
                        Log in
                    </Button>

                    <div className="flex items-center gap-3 py-1">
                        <div className="h-px flex-1 bg-ink-200" />
                        <span className="text-xs font-medium text-ink-400">OR</span>
                        <div className="h-px flex-1 bg-ink-200" />
                    </div>

                    <a
                        href="https://ecommerce-backend-o9vh.onrender.com/oauth2/authorization/google"
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-ink-200 py-3 text-sm font-semibold text-ink-700 transition-colors hover:bg-ink-50"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" className="h-5 w-5" />
                        Continue with Google
                    </a>

                    <p className="pt-1 text-center text-sm text-ink-500">
                        Don't have an account?{" "}
                        <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
