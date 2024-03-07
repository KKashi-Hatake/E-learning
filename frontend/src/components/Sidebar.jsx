import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/Logo.jpg";
import { IoHomeOutline } from "react-icons/io5";
import { GiOpenBook } from "react-icons/gi";
import { CiUser } from "react-icons/ci";
import { IoHelpBuoyOutline } from "react-icons/io5";
import { useTheme } from "../context";
import { PiSignOutBold } from "react-icons/pi";
import { MdLogin } from "react-icons/md";
import axios from "axios";

const Sidebar = () => {
  const { user, toggleUser,toggleUserData } = useTheme();
  const handler = async ()=>{
    await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}user/logout`
    );
    toggleUser(false)
    toggleUserData({})
    
  }
  useEffect(() => {
    const getres = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}user/isLoggedIn`
        );
        toggleUser(response.data.isLoggedIn);
      } catch (error) {
        toggleUser(false);
      }
    };
    getres();
  }, [user]);

  return (
    <div className="h-[95vh] relative w-[18vw] bg-[#fff] col-span-1 dark:bg-slate-300">
      <header className="h-[15vh] w-[80%] flex">
        <div className="h-full w-1/2 ">
          <img className="h-full w-full" src={logo} alt="" />
        </div>
        <div className="h-full w-1/2 ">
          <p className=" h-full grid place-items-center uppercase text-3xl font-semibold text-purple-600">
            Logo
          </p>
        </div>
      </header>
      <main className="text-[#716c6c]">
        <NavLink exact='true' to="/" className={({isActive})=>(isActive?'active':'')}>
          <div className="h-14 w-full flex justify-start items-center ">
            <div className="w-[50%] h-full flex justify-center items-center ">
              <IoHomeOutline className="text-2xl  " />
              <p className="text-base pl-2 font-semibold ">Home</p>
            </div>
          </div>
        </NavLink>
        <NavLink exact='true' to="/courses" className={({isActive})=>(isActive?'active':'')}>
          <div className="h-14 w-full flex justify-start items-center ">
            <div className="w-[65%] h-full flex justify-center items-center">
              <GiOpenBook className="text-2xl  " />
              <p className="text-base pl-2 font-semibold ">My courses</p>
            </div>
          </div>
        </NavLink>
        <NavLink exact='true' to="/forum" className={({isActive})=>(isActive?'active':'')}>
          <div className="h-14 w-full flex justify-start items-center ">
            <div className="w-[50%] h-full flex justify-center items-center ">
              <GiOpenBook className="text-2xl  " />
              <p className="text-base pl-2 font-semibold ">Forum</p>
            </div>
          </div>
        </NavLink>
        <NavLink exact='true' to="/profile" className={({isActive})=>(isActive?'active':'')}>
          <div className="h-14 w-full flex justify-start items-center ">
            <div className="w-[50%] h-full flex justify-center items-center ">
              <CiUser className="text-2xl  " />
              <p className="text-base pl-2 font-semibold ">Profile</p>
            </div>
          </div>
        </NavLink>
      </main>
      <footer className=" absolute bottom-5  h-[15%] w-full text-[#716c6c]">
        <NavLink exact='true' to="/help" className={({isActive})=>(isActive?'active':'')}>
          <div className="h-14 w-full flex justify-start items-center ">
            <div className="w-[40%] h-full flex justify-center items-center ">
              <IoHelpBuoyOutline className="text-2xl  " />
              <p className="text-base pl-2 font-semibold ">Help</p>
            </div>
          </div>
        </NavLink>
        <NavLink exact='true' to="/login" className={({isActive})=>(isActive?'active':'')}>
          <div className="h-14 w-full flex justify-start items-center ">
            {user ? (
              <div className="w-[50%] h-full  ">
                <button onClick={handler} className="h-full w-full flex justify-center items-center ">
                  <PiSignOutBold className="text-2xl  " />
                  <p className="text-base pl-2 font-semibold ">Sign out</p>
                </button>
              </div>
            ) : (
              <div className="w-[50%] h-full flex justify-center items-center ">
                <MdLogin className="text-2xl -ml-4 " />
                <p className="text-base pl-2 font-semibold ">Sign in</p>
              </div>
            )}
          </div>
        </NavLink>
      </footer>
    </div>
  );
};

export default Sidebar;
// border-2 border-red-600
