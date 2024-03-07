import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Course from "../components/Course";
import Loader from "../components/Loader";
import { useTheme } from "../context";
import axios from 'axios';

const Home = () => {
  const {user, userData} = useTheme();
  const [pages, setPages] = useState(1);
  const [data, setData] = useState([[]]);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    const res = axios.get(`${import.meta.env.VITE_BACKEND_URL}course/all?limit=5&page=${pages}`)
    .then(function (response) {
      setData(response.data.data);
    })
    .catch(function (error) {
      console.log(error);
    })
    
    setLoader(false);
  }, [pages]);

    let btn=new Array(data[1]).fill(1);
    console.log('after submitting the request user',user)
    console.log('after submitting the request user data',userData)
  return loader ? (
    <Loader />
  ) : (
    <div className="col-span-4 h-[93vh] w-full overflow-auto ">
      <Header />
      {
        data.map((e,i)=>{
          if(i<data.length-1){
            return <Course key={i} course={e} />
          }
        })
      }
      <div className="h-[5vh] flex justify-center">
        {btn.map((e, i) => (
          <button
          onClick={(e)=>pages!==e.target.value?setPages(Number(e.target.value)):''}
            key={i}
            value={i+1}
            className={`h-[80%] w-8 mx-2  rounded-lg ${
              pages === i + 1
                ? "text-black bg-[#a3a8a7]"
                : "text-white bg-black"
            } `}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
