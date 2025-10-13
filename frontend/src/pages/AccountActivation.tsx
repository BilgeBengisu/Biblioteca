import { useEffect, useState } from "react";
import api from "../lib/api";
import { useParams, useNavigate } from "react-router-dom";

const AccountActivation: React.FC = () => {
    const { uid, token } = useParams<{ uid: string; token: string }>();
    const navigate = useNavigate();
    
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState<string>("");

    // detect which access view is being requested: activation message or activation attempt
    useEffect(() => {
        if (uid && token) {
            activateAccount(uid, token);
        }
    }, [uid, token]);

    async function activateAccount(uidParam: string, tokenParam: string) {
        setStatus("loading");
        console.log("Activating account with", uidParam, tokenParam);

        try {
            const { status } = await api.post("/auth/users/activation/", {
            uid: uidParam,
            token: tokenParam,
        });

        // Djoser default returns 204 No Content on success. We treat any 2xx as success.
        if (status >= 200 && status < 300) {
            setStatus("success");
            setMessage("Your account has been activated. Redirecting to login...");
            // If backend returns tokens in response body, store them:
            // if (data.access && data.refresh) { localStorage.setItem('access_token', data.access); ...; navigate('/profile') }
            setTimeout(() => navigate("/login"), 1500);
        } else {
            throw new Error("Activation failed");
        }
        } catch (err: any) {
            setStatus("error");
            const msg =
                err?.response?.data || err?.response?.statusText || err?.message || "Activation failed";
            setMessage(typeof msg === "string" ? msg : JSON.stringify(msg));
        }
    }

    return (
            <div className="container mt-5">
                <h1>Activa tu cuenta</h1>
                <p>Por favor, revisa tu correo electrónico para activar tu cuenta.</p>
                {status === "loading" && <p>Activando tu cuenta...</p>}
                {status === "success" && <p>{message}</p>}
                {status === "error" && <p className="text-red-600">{message}</p>}
            </div>
    );
}

export default AccountActivation;