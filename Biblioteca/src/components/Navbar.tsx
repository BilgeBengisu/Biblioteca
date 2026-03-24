import { NavLink, Link, useLocation } from "react-router";
import logo from "../assets/logo.png";
import "./Navbar.css";
import { useAuth } from "../contexts/AuthContext.tsx";
import default_avatar from "../assets/default-avatar.svg";
import { BookOpen, Library, Search, LogOut, LogIn, UserPlus } from "lucide-react";

export const Navbar = () => {
    const { user, profile, signOut } = useAuth();
    const location = useLocation();
    const hideLinks = location.pathname === "/complete-profile";

    const navClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? "nav-link nav-link--active" : "nav-link";

    return (
        <nav className="navbar">
            <div>
                <div className="navbar-logo">
                    <Link to={"/"}>
                        <img src={logo} alt="Biblioteca Logo" className="logo-img" />
                    </Link>
                </div>
            </div>
            {!hideLinks && (
                <ul className="navbar-links">
                    {user ? (
                        <>
                            <li>
                                <NavLink to="/posts" className={navClass}>
                                    <BookOpen size={15} /> Publicaciones
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/books" className={navClass}>
                                    <Library size={15} /> Libros
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/search" className={navClass}>
                                    <Search size={15} /> Buscar
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/profile" className={({ isActive }) =>
                                    isActive ? "nav-link nav-link--active profile-link" : "nav-link profile-link"
                                }>
                                    <img
                                        src={profile?.avatar_url || default_avatar}
                                        alt="Profile"
                                        className="navbar-avatar"
                                    />
                                    Perfil
                                </NavLink>
                            </li>
                            <li>
                                <button className="nav-link nav-link--signout" onClick={signOut}>
                                    <LogOut size={15} /> Cerrar sesión
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <NavLink to="/login" className={navClass}>
                                    <LogIn size={15} /> Entrar
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/register" className={navClass}>
                                    <UserPlus size={15} /> Registrarse
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>
            )}
        </nav>
    );
};
