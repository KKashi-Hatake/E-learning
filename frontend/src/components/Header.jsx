import React from "react";
import { useTheme } from "../context";
import { CiMail } from "react-icons/ci";
import { HiOutlineBell } from "react-icons/hi2";
import { IoMoonOutline } from "react-icons/io5";
import { GoSun } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";

const Header = () => {
  const name = "Shashank Srivastava".split(" ");
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="w-full h-[9vh] flex justify-end text-[#afa9a9] dark:bg-[#192647d7] dark:text-white ">
      <main className=" w-[30%] h-full flex justify-between items-center px-2 ">
        <CiMail className="text-2xl " />
        <HiOutlineBell className="text-2xl " />
        {theme === "light" ? (
          <IoMoonOutline
            onClick={() => toggleTheme()}
            className="text-2xl "
          />
        ) : (
          <GoSun
            onClick={() => toggleTheme()}
            className="text-2xl "
          />
        )}
        <div className="w-auto h-full flex items-center ">
          <img
            className="w-12 h-12 rounded-full  object-cover"
            src="http://res.cloudinary.com/dgmjoudfg/image/upload/v1709018115/cou7cqxg0bxnhjdegbge.jpg"
            alt=""
          />
          <p className="pl-2 text-[#7e7c7c] ">{name[0]}</p>
        </div>
            <IoIosArrowDown className="text-2xl text-[#afa9a9]"/>
      </main>
    </header>
  );
};

export default Header;
