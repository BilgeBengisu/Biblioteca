
import { Route, Routes } from "react-router-dom";
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

function App() {
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
          <Route path="/profile/:username" element={<Profile />} /> 
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
