import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        role: "user",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email) {
            alert("All fields required");
            return;
        }

        try {
            // 🔥 BACKEND CALL
            await axios.post(
                "http://localhost:8080/api/auth/send-otp",
                {
                    email: form.email,
                }
            );

            // 🔥 SAVE TEMP DATA
            localStorage.setItem("signupName", form.name);
            localStorage.setItem("signupEmail", form.email);
            localStorage.setItem("signupRole", form.role);

            alert("OTP sent successfully");

            navigate("/verify-otp");

        } catch (err) {
            console.log(err);
            alert("Failed to send OTP");
        }
    };

    return (
        <div className="flex justify-center mt-20">
            <form
                onSubmit={handleSendOtp}
                className="w-96 p-6 shadow-lg rounded bg-white"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Signup</h2>

                {/* ROLE */}
                <select
                    name="role"
                    className="w-full border p-2 mb-3"
                    value={form.role}
                    onChange={handleChange}
                >
                    <option value="user">User</option>
                    <option value="merchant">Merchant</option>
                </select>

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
                    className="w-full border p-2 mb-4"
                    onChange={handleChange}
                />

                <button className="w-full bg-blue-500 text-white p-2 rounded">
                    Send OTP
                </button>
            </form>
        </div>
    );
}

export default Signup;