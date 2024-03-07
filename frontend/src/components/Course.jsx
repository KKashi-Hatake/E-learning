import React from "react";

const Course = ({ course }) => {
  return (
    <main className="h-[20vh] w-[78vw] bg-[#fff] flex rounded-lg mb-2 ">
      <div className="h-full w-[20%] flex justify-center items-center">
        <img
          className="h-[95%] w-[95%] rounded-md object-cover"
          src={course.coverImage}
          alt=""
        />
      </div>
      <div className="w-[78%] h-full flex flex-col ">
        <div className="w-full h-[45%] flex ">
          <p className="w-[65%] uppercase text-[#14253ec4] text-xl font-semibold p-2">
            {course.title}
          </p>
          <div className="w-[35%] flex justify-end items-center">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src={course.user.avatar}
              alt=""
            />
            <p className="p-2 ">{course.user.name}</p>
          </div>
        </div>
        <div className="h-[50%] w-full flex  ">
          <div className="h-full w-full flex justify-between items-end">
            <div className="h-full w-[75%] ">
              <p className="text-wrap pl-2">{course.description}</p>
            </div>
            <div className="h-full w-[25%] flex flex-col justify-end items-end ">
              <p className="text-[#716c6c] text-xs italic">{`Category: ${course.category}`}</p>
              <p className="text-[#716c6c] text-xs italic">{`Level: ${course.level}`}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Course;
