
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { Posts } from "./pages/Posts";
import { Books } from "./pages/Books";
import { BookView} from "./pages/BookView";
import { AuthCallback } from "./pages/AuthCallBack";
import { Search } from "./pages/Search";
import { ConfirmEmail } from "./pages/ConfirmEmail";
import { CompleteProfile } from "./pages/CompleteProfile";
import { EditProfile } from "./pages/EditProfile";
import { useAuth } from "./contexts/AuthContext";
import { isUsernameMissing } from "./utils/profile";

function App() {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  const needsUsername = Boolean(user && isUsernameMissing(profile?.username));
  if (loading) {
    return <div className="p-6">Cargando…</div>;
  }

  if (needsUsername && location.pathname !== "/complete-profile") {
    return <Navigate to="/complete-profile" replace />;
  }

  if (!user && location.pathname === "/complete-profile") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/posts" element={<Posts/>} />
          <Route path="/books" element={<Books/>} />
          <Route path="/books/:id" element={<BookView />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/profile/:username" element={<Profile />} /> 
          <Route path="/search" element={<Search />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
