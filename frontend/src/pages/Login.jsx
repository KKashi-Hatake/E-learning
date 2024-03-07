import React, { useRef, useState } from "react";
import axios from "axios";
import { useTheme } from "../context";
import { useNavigate } from "react-router-dom";
import { MdAlternateEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import img from "../assets/user.jpg";
axios.defaults.withCredentials = true;

const Login = () => {
  const [form, setForm] = useState("signin");
  const { user, userData, toggleUser, toggleUserData } = useTheme();
  const [val, setVal] = useState({
    name: "",
    email: "",
    password: "",
    avatar: "",
  });
  const inputRef = useRef();
  const imgChange = (e) => {
    setVal({ ...val, avatar: e.target.files[0] });
  };
  const uploadHandler = (e) => {
    e.preventDefault();
    inputRef.current.click();
  };

  const navigate = useNavigate();
  function handler(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", val.name);
    formData.append("email", val.email);
    formData.append("password", val.password);
    formData.append("avatar", val.avatar);
    async function getUser() {
      try {
        if (form === "signup") {
          console.log("from front end", formData.values());
          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}user/register`,
            formData,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              // credentials: 'include',
              withCredentials: true,
            }
          );
          toggleUser(true);
          toggleUserData(res.data.user);
          navigate("/");
        } else {
          const cred = { email: val.email, password: val.password };
          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}user/login`,
            cred,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              // credentials: 'include',
              withCredentials: true,
            }
          );
          toggleUser(true);
          toggleUserData(res.data.user);
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  }

  return form === "signup" ? (
    <div className="col-span-4 h-[93vh] w-full flex justify-center items-center ">
      <div className=" h-[75%] w-[60%]  rounded-3xl">
        <div className="h-[10%] w-full flex justify-center text-white font-semibold ">
          <span className="h-full p-2 w-auto text-sm  pt-3 ">
            Already have an account?
          </span>
          <button
            onClick={() => setForm("signin")}
            className=" text-[0.8rem] underline decoration-solid hover:text-[#e6e4e4da] "
          >
            Sign in
          </button>
        </div>
        <form className="h-[90%] w-full ">
          <div className="h-[25%] flex justify-evenly items-center ">
            {val.avatar ? (
              <img
                className="h-[6.5rem] w-[6.5rem] border-2 rounded-full object-contain"
                src={URL.createObjectURL(val.avatar)}
                alt=""
              />
            ) : (
              <img
                src={img}
                className="h-[6.5rem] w-[6.5rem] border-2 rounded-full object-cover"
              />
            )}
            <input
              type="file"
              ref={inputRef}
              onChange={imgChange}
              style={{
                display: "none",
              }}
            />
            <button
              onClick={uploadHandler}
              type="button"
              className="w-[25%] h-[35%] relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
            >
              <span className="h-[90%] w-[97%] relative px-5 py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 ">
                Upload Avatar
              </span>
            </button>
          </div>
          <div className="w-full h-[75%] flex flex-col justify-around items-center ">
            <div className="h-[12%] w-[60%] relative  ">
              <FaRegUser className="absolute top-[50%] left-3 translate-y-[-50%] text-slate-900 " />
              <input
                className=" h-[100%] w-[100%]  bg-transparent pl-10 text-white caret-black outline-none rounded-3xl border-b-2 border-neutral-300  "
                type="text"
                value={val.name}
                onChange={(e) => setVal({ ...val, name: e.target.value })}
                placeholder="Name"
              />
            </div>
            <div className="h-[10%] w-[60%] relative">
              <MdAlternateEmail className="absolute top-[50%] left-3 translate-y-[-50%] text-slate-900 " />
              <input
                className="h-[100%] w-[100%] pl-10 bg-transparent text-white caret-black outline-none rounded-3xl border-b-2 border-neutral-300 "
                type="email"
                value={val.email}
                onChange={(e) => setVal({ ...val, email: e.target.value })}
                placeholder="Email"
              />
            </div>
            <div className="h-[10%] w-[60%] relative">
              <RiLockPasswordLine className="absolute top-[50%] left-3 translate-y-[-50%] text-slate-900 " />
              <input
                className="h-[100%] w-[100%] pl-10 bg-transparent text-white caret-black outline-none rounded-3xl border-b-2 border-neutral-300 "
                type="password"
                value={val.password}
                onChange={(e) => setVal({ ...val, password: e.target.value })}
                placeholder="Password"
              />
            </div>
            <button
              onClick={handler}
              type="button"
              className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <div className="col-span-4 h-[93vh] w-full flex justify-center items-center ">
      <div className=" h-[75%] w-[60%]  rounded-3xl">
        <div className="h-[10%] w-full flex justify-center text-white font-semibold ">
          <span className="h-full p-3.5 w-auto text-sm  ">
            Don't have an account?
          </span>
          <button
            onClick={() => setForm("signup")}
            className=" text-[0.8rem] underline decoration-solid hover:text-[#e6e4e4da] "
          >
            Sign Up
          </button>
        </div>
        <div className="h-[10%] w-full grid place-items-center">
          <p className="text-xl font-mono font-semibold uppercase text-neutral-200 tracking-wide">
            Login
          </p>
        </div>
        <form className="h-[90%] w-full ">
          <div className="w-full h-[85%] flex flex-col justify-around items-center ">
            <div className="h-[10%] w-[60%] relative">
              <MdAlternateEmail className="absolute top-[50%] left-3 translate-y-[-50%] text-slate-900 " />
              <input
                className="h-[100%] w-[100%] pl-10 bg-transparent text-black caret-black outline-none rounded-3xl border-b-2 border-[#ffffffc0] cursor-pointer hover:placeholder:text-[#fff] "
                type="email"
                value={val.email}
                onChange={(e) => setVal({ ...val, email: e.target.value })}
                placeholder="Email"
              />
            </div>
            <div className="h-[10%] w-[60%] relative">
              <RiLockPasswordLine className="absolute top-[50%] left-3 translate-y-[-50%] text-slate-900 " />
              <input
                className="h-[100%] w-[100%] pl-10 bg-transparent text-black caret-black outline-none rounded-3xl border-b-2 border-[#ffffffc0] cursor-pointer hover:placeholder:text-[#fff] "
                type="password"
                value={val.password}
                onChange={(e) => setVal({ ...val, password: e.target.value })}
                placeholder="Password"
              />
            </div>
            <button
              onClick={handler}
              type="button"
              className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
