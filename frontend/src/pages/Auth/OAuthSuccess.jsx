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

        <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-ink-50 px-4">

            <div className="card-surface flex flex-col items-center gap-4 p-10 text-center animate-scale-in">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
                    <Loader2 size={30} className="animate-spin text-brand-600" />
                </div>

                <h2 className="text-xl font-bold text-ink-950">
                    Signing you in…
                </h2>

                <p className="max-w-xs text-sm text-ink-500">
                    Completing your Google login and loading your account.
                </p>

            </div>

        </div>
    );
};

export default OAuthSuccess;