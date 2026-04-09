import { Link } from "react-router-dom";

function Login() {
    return (
        <div className="flex justify-center mt-20">
            <div className="w-80 p-6 shadow-lg rounded bg-white">

                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-3"
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-3"
                />

                <button className="w-full bg-blue-500 text-white p-2 rounded">
                    Login
                </button>


                <p className="text-sm text-center mt-3">
                    <Link to="/forgot-password" className="text-blue-500">
                        Forgot Password?
                    </Link>
                </p>

            </div>
        </div>
    );
}

export default Login;