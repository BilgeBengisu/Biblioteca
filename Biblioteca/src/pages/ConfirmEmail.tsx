import { useLocation, Link } from "react-router-dom";

type LocationState = {
  email?: string;
};

const MailIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const ConfirmEmail = () => {
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;
  const email = state?.email;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
            <MailIcon />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Revisa tu correo
        </h1>

        <p className="text-gray-500 text-sm mb-2">
          {email ? (
            <>
              Te enviamos un enlace de confirmación a{" "}
              <span className="font-medium text-gray-700">{email}</span>.
            </>
          ) : (
            "Te enviamos un enlace de confirmación a tu correo."
          )}
        </p>

        <p className="text-gray-400 text-sm mb-8">
          Confirma tu cuenta para empezar a usar tu Biblioteca.
        </p>

        <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 mb-8 text-left">
          <p className="text-xs text-amber-700">
            ¿No ves el correo? Revisa tu carpeta de spam o correo no deseado.
          </p>
        </div>

        <Link
          to="/login"
          className="w-full inline-block py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition"
        >
          Ir a iniciar sesión
        </Link>

      </div>
    </div>
  );
};
