import { Link } from "react-router";
import logo from "../assets/logo.png";
import "./Navbar.css";
import { useAuth } from "../contexts/AuthContext.tsx";
import default_avatar from "../assets/default-avatar.svg";

export const Navbar = () => {
    const { user, profile, signOut } = useAuth();
    return (
        <nav  className="navbar"> 
            <div>
                <div className="navbar-logo">
                    <Link to={"/"}>
                        <img src={logo} alt="Biblioteca Logo" className="logo-img" />
                    </Link>
                </div>
            </div>
            <ul className="navbar-links">
                {user ? (
                    <>
                        <li>
                            <Link to="/posts">Publicaciones</Link>
                        </li>
                        <li>
                            <Link to="/books">Libros</Link>
                        </li>
                        <li>
                            <Link to="/search" className="navbar-search-btn">
                                Buscar
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile" className="profile-link">
                                <img
                                    src={
                                        profile?.avatar_url ??
                                        (user?.user_metadata?.avatar_url as string | undefined) ??
                                        default_avatar
                                    }
                                    alt="Profile"
                                    className="navbar-avatar"
                                />
                            </Link>
                        </li>
                        <li>
                            <button onClick={signOut}>Cerrar sesión</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login">Entrar</Link>
                        </li>
                        <li>
                            <Link to="/register">Registrarse</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    )
};
