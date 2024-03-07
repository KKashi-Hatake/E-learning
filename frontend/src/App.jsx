import { Suspense, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/index";
import Loader from "./components/Loader.jsx";
import img from "./assets/bg2.jpg";
import { lazy } from "react";

const Sidebar = lazy(() => import("./components/Sidebar.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const MyCourse = lazy(() => import("./pages/MyCourse.jsx"));
const Forum = lazy(() => import("./pages/Forum.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Help = lazy(() => import("./pages/Help.jsx"));
const Footer = lazy(() => import("./components/Footer.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));

function App() {
  const [userData, setUserData] = useState({});
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(false);
  const toggleUser = (val) => {
    setUser(val);
  };
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };
  const toggleUserData = (val) => {
    setUserData(val);
  };
  return (
    <div
      className={`h-screen relative w-full bg-[#ffffff34] grid grid-cols-5 ${theme}`}
    >
      <div className="absolute top-0 left-0 w-full h-screen object-contain -z-10 blur-[2px]">
        <img className="h-full w-full" src={img} alt="" />
      </div>
      <ThemeProvider
        value={{
          theme,
          user,
          userData,
          toggleUserData,
          toggleUser,
          toggleTheme,
        }}
      >
        <Suspense fallback={<Loader />}>
          <Router>
            <Sidebar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<MyCourse />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/help" element={<Help />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Router>
        </Suspense>
      </ThemeProvider>
      <Footer />
    </div>
  );
}

export default App;
