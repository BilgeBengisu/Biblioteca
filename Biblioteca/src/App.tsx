
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

  const needsUsername = !loading && Boolean(user && isUsernameMissing(profile?.username));

  return (
    <div>
      <Navbar />
      <div>
        {loading ? (
          <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6 flex items-start gap-6 animate-pulse">
              <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-6 w-36 rounded bg-neutral-100 dark:bg-neutral-800" />
                <div className="h-3 w-24 rounded bg-neutral-100 dark:bg-neutral-800" />
                <div className="h-4 w-48 rounded bg-neutral-100 dark:bg-neutral-800" />
              </div>
            </div>
          </div>
        ) : needsUsername && location.pathname !== "/complete-profile" ? (
          <Navigate to="/complete-profile" replace />
        ) : !user && location.pathname === "/complete-profile" ? (
          <Navigate to="/login" replace />
        ) : (
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
        )}
      </div>
    </div>
  )
}

export default App
