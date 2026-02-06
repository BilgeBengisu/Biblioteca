import { useLocation, Link } from "react-router-dom";
import "./Register.css";

type LocationState = {
  email?: string;
};

export const ConfirmEmail = () => {
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;
  const email = state?.email;

  return (
    <div className="register-container">
      <h1>Confirma tu correo</h1>
      <br />
      <p>
        {email
          ? `Te enviamos un correo a ${email}. Confirma tu cuenta para empezar tu Biblioteca!`
          : "Te enviamos un correo de confirmación. Confirma tu Biblioteca."}
      </p>
      <br />
      <Link to="/login">Ir a iniciar sesión</Link>
    </div>
  );
};
