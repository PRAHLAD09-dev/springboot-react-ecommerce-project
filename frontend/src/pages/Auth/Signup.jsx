import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.password) {
            alert("All fields required");
            return;
        }

        if (form.password !== form.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        console.log(form);

        localStorage.setItem("signupEmail", form.email);

        navigate("/verify-otp");
    };

    return (
        <div className="flex justify-center mt-20">
            <form
                onSubmit={handleSignup}
                className="w-96 p-6 shadow-lg rounded bg-white"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Signup</h2>

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full border p-2 mb-3"
                    onChange={handleChange}
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-3"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border p-2 mb-3"
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full border p-2 mb-4"
                    onChange={handleChange}
                />

                <button className="w-full bg-green-500 text-white p-2 rounded">
                    Register
                </button>
            </form>
        </div>
    );
}

export default Signup;