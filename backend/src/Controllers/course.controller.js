import ErrorHandler from "../Utils/ErrorHandler.js";
import { Course } from "../Models/course.model.js";
import { asyncHandler } from "../Utils/asynHandler.js";
import uploadOnCloudinary from "../Utils/cloudinary.js";

//Post route for creating a new course
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, category, level } = req.body;
  if (!(title && description && level && category)) {
    throw new ErrorHandler(400, "All fields are mandatory");
  }
  let course = await Course.findOne({ title });
  if (course) {
    throw new ErrorHandler(400, "Title already taken");
  }

  const videoLocalPath = req.files?.videoFile[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!(videoLocalPath && coverImageLocalPath)) {
    throw new ErrorHandler(400, "Video and thumbnail both are required.");
  }
  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!(videoFile && coverImage)) {
    throw new ErrorHandler(
      500,
      "Something went wrong while uploading video and thumbnail"
    );
  }

  course = await Course.create({
    title,
    description,
    level,
    category,
    coverImage: coverImage?.url,
    salesVideo: videoFile?.url,
    createdBy: req.user._id,
  });
  res.status(201).json({
    success: true,
    message: "Course created successfully",
    course,
  });
});

//get all courses
export const getAllCourses = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 5);
  const skip = (page - 1) * limit;
  // let course = await Course.find().skip(skip).limit(limit);
  let course = await Course.aggregate(
    [
      {
        $skip: 0,
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $addFields:
          {
            user: {
              $arrayElemAt: ["$author", 0],
            },
          },
      },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          level: 1,
          coverImage: 1,
          "user.name": 1,
          "user.avatar": 1,
        },
      },
    ]
  );
  if (!course) {
    throw new ErrorHandler();
  }
  let count = await Course.find().countDocuments();
  count = Math.ceil(count / limit);
  let data = [...course, count];

  res.status(200).json({
    success: true,
    message: "All courses fetched",
    data,
  });
});

//update an existing course(only title, level, description and category)
export const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById({ _id: id });
  if (!course) {
    throw new ErrorHandler(404, "Course not found");
  }

  if (course.createdBy.toString() !== req.user._id.toString()) {
    throw new ErrorHandler(401, "Unauthorized Request");
  }
  const { title, description, category, level } = req.body;
  if (title.toLowerCase() === course.title) {
    course.description = description;
    course.category = category;
    course.level = level;
    await course.save({ validateBeforSave: false });
    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  }
  const course2 = await Course.findOne({ title });
  if (course2) {
    throw new ErrorHandler(
      409,
      "Conflict occurs while updating 'Title' already exists"
    );
  }
  course.description = description;
  course.category = category;
  course.title = title;
  course.level = level;
  await course.save({ validateBeforSave: false });
  return res.status(200).json({
    success: true,
    message: "Course updated successfully",
    course,
  });
});

//get a specific course
export const getSingleCourse = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      throw new ErrorHandler(404, "Course not found");
    }
    res.status(200).json({
      success: true,
      message: "Course Found",
      course,
    });
  } catch (error) {
    throw new ErrorHandler(404, "Course not fond");
  }
});

//delete a specific course
export const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) {
    throw new ErrorHandler(404, "Course does not exists");
  }
  if (course.createdBy.toString() !== req.user._id.toString()) {
    throw new ErrorHandler(401, "Unauthorized Request");
  }
  await Course.deleteOne({ _id: id });
  res.status(200).json({
    success: true,
    message: "Course deleted Successfully",
  });
});
