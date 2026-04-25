import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
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
            await axios.post(
                "http://localhost:8080/api/auth/send-otp",
                {
                    email: form.email,
                }
            );

            localStorage.setItem("signupName", form.name);
            localStorage.setItem("signupEmail", form.email);

            alert("OTP sent successfully");

            navigate("/verify-otp");

        } catch (err) {
            console.log(err.response?.data || err);
            alert("Failed to send OTP");
        }
    };

    return (
        <div className="flex justify-center mt-20">
            <form
                onSubmit={handleSendOtp}
                className="w-96 p-6 shadow-lg rounded bg-white"
            >
                <h2 className="text-xl font-bold mb-4 text-center">
                    Signup
                </h2>

                {/* NAME */}
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="w-full border p-2 mb-3"
                    onChange={handleChange}
                />

                {/* EMAIL */}
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