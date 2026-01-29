import { Link } from "react-router";
import logo from "../assets/logo.png";
import "./Navbar.css";
import { useAuth } from "../contexts/AuthContext.tsx";
import default_avatar from "../assets/default-avatar.svg";

export const Navbar = () => {
    const { user, signInWithGoogle, signOut } = useAuth();
    return (
        <nav  className="navbar"> 
            <div>
                <div className="navbar-logo">
                    <Link to={"/"}>
                        <img src={logo} alt="Biblioteca Logo" className="logo-img" />Biblioteca
                    </Link>
                </div>
            </div>
            <ul className="navbar-links">
                <div>
                    {user ? (
                        <div>
                            <li>
                                <Link to="/posts">Posts</Link>
                            </li>
                            <li>
                                <Link to="/books">Books</Link>
                            </li>
                            <Link to="/profile" className="profile-link">
                                <img
                                src={
                                    (user?.profile?.picture_url as string | undefined) ??
                                    (user?.user_metadata?.picture_url as string | undefined) ??
                                    default_avatar
                                }
                                alt="Profile"
                                className="navbar-avatar"
                                />
                            </Link>
                            <button onClick={signOut}>Cerrar sesión</button>
                        </div>
                    ) : (
                        <div>
                            <li>
                                <button onClick={signInWithGoogle}>Google</button>
                            </li>
                            <li>
                                <Link to="/login">Entregar</Link>
                            </li>
                            <li>
                                <Link to="/register">Registarse</Link>
                            </li>
                        </div>
                    )}
                </div>
            </ul>
        </nav>
    )
};