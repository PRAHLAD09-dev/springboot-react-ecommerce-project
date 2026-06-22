import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

const OAuthSuccess = () => {

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {

        const token =
            searchParams.get("token");

        if (token) {

            localStorage.setItem(
                "token",
                token
            );

            localStorage.setItem(
                "role",
                "user"
            );

            window.dispatchEvent(
                new Event("authChanged")
            );

            navigate("/");
        }
        else {

            navigate("/login");
        }

    }, [navigate, searchParams]);

    return (

        <div
            className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-gray-100
            "
        >

            <div
                className="
                bg-white
                rounded-2xl
                shadow-xl
                p-10
                flex
                flex-col
                items-center
                gap-4
                "
            >

                <Loader2
                    size={50}
                    className="
                    text-blue-600
                    animate-spin
                    "
                />

                <h2
                    className="
                    text-2xl
                    font-bold
                    text-gray-800
                    "
                >
                    Signing You In...
                </h2>

                <p
                    className="
                    text-gray-500
                    text-center
                    "
                >
                    Completing your Google login
                    and loading your account.
                </p>

            </div>

        </div>
    );
};

export default OAuthSuccess;