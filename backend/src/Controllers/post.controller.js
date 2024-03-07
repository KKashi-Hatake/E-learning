import { Post } from "../Models/post.model.js";
import { Like } from "../Models/like.model.js";
import { Comment } from "../Models/comment.model.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import { asyncHandler } from "../Utils/asynHandler.js";
import uploadOnCloudinary from "../Utils/cloudinary.js";
import { Error } from "mongoose";

//get all posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const page=Number(req.query.page||1);
  const limit=Number(req.query.limit||5);
  const skip=(page-1)*limit;
  const post = await Post.find().skip(skip).limit(limit);
  if (!post) {
    throw new ErrorHandler(500, "Something went wrong");
  }
  res.status(200).json({
    success: true,
    message: "Posts fetched",
    post,
  });
});

//get all comments for a specific post
export const getAllComments = asyncHandler(async (req, res) => {
  const page=Number(req.query.page||1);
  const limit=Number(req.query.limit||5);
  const skip=(page-1)*limit;
  const { id } = req.params;
  const comment = await Comment.findOne({ post: id });
  if (!comment) {
    throw new ErrorHandler(500, "Something went wrong");
  }
  const data=comment.writtenBy.slice(skip,skip+limit)
  res.status(200).json({
    success: true,
    message: "Posts fetched",
    data
  });
});

// ********************************************************************************************

// post request for creating new post
export const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const fileLocalPath = req.file?.path;
  if (!(fileLocalPath || content)) {
    throw new ErrorHandler(400, "File or content is required");
  }
  let sharedResource = { url: "" };
  let post;
  if (fileLocalPath) {
    sharedResource = await uploadOnCloudinary(fileLocalPath);
    if (!sharedResource) {
      throw new ErrorHandler(
        500,
        "Something went wrong while uploading file on cloudinary"
      );
    }
  }

  if (content) {
    post = await Post.create({
      owner: req.user._id,
      content,
      sharedResource: sharedResource.url,
    });
  } else {
    post = await Post.create({
      owner: req.user._id,
      content: "",
      sharedResource: sharedResource.url,
    });
  }
  res.status(200).json({
    success: true,
    message: "Post created successfully",
    post,
  });
});

// post request for updating likes
export const updateLikes = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    throw new ErrorHandler(404, "Post not found");
  }
  const like = await Like.findOne({ post: id });
  if (!like) {
    await Like.create({
      user: [req.user._id],
      post: id,
    });
    post.likes++;
    await post.save({ validateBeforeSave: false });
    return res.status(200).json({
      success: true,
      message: "You liked this post",
    });
  } else if (like.user.length === 0) {
    like.user.push(req.user._id);
    await like.save({
      validateBeforeSave: false,
    });
    post.likes++;
    await post.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message: "You liked this post",
    });
  } else {
    const isLiked = like.user.filter(
      (e) => e.toString() !== req.user.id.toString()
    );
    if (like.user.length === isLiked.length) {
      like.user.push(req.user._id);
      await like.save({
        validateBeforeSave: false,
      });
      post.likes++;
      await post.save({ validateBeforeSave: false });
      res.status(200).json({
        success: true,
        message: "You liked this post",
      });
    }
    like.user = isLiked;
    await like.save({ validateBeforeSave: false });
    post.likes--;
    await post.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message: "Unliked the post",
    });
  }
});

//post request for comments
export const addComments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const post = await Post.findById(id);
  if (!post) {
    throw new ErrorHandler(404, "Post not found");
  }
  if (!text) {
    throw new ErrorHandler(400, "Text field is mandatory");
  }
  const comment = await Comment.findOne({ post: id });
  if (!comment) {
    await Comment.create({
      writtenBy: [
        {
          user: req.user._id,
          text,
          reply: [],
        },
      ],
      post: id,
    });
    post.comments++;
    await post.save({ validateBeforeSave: false });
    return res.status(200).json({
      success: true,
      message: "You've commented on this post",
    });
  } else {
    comment.writtenBy.push({
      user: req.user._id,
      text,
      reply: [],
    });
    await comment.save({
      validateBeforeSave: false,
    });
    post.comments++;
    await post.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      message: "You've commented on this post",
    });
  }
});

//post request for replies
export const addReply = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text, user_id } = req.body;

  if (!(text && user_id)) {
    throw new ErrorHandler(400, "Text and user id both fields are mandatory");
  }
  const comment = await Comment.findOne({ post: id });
  if (!comment) {
    throw new ErrorHandler(404, "Comment not found");
  }
  const commentedUser = comment.writtenBy.find(
    (e) => e.user.toString() === user_id.toString()
  );
  if (!commentedUser) {
    throw new ErrorHandler(400, "Commented user not found");
  }
  commentedUser.reply.push({
    repliedBy: req.user._id,
    text,
  });
  await comment.save({
    validateBeforeSave: false,
  });

  res.status(200).json({
    success: true,
    message: "You've commented on this post",
  });
});

// **********************************************************************************************

// delete a post
export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    throw new ErrorHandler(404, "Post not found");
  }
  if (post.owner.toString() !== req.user._id.toString()) {
    throw new ErrorHandler(
      403,
      "You are not authorised to access this resource"
    );
  }
  await Post.deleteOne({ _id: id });
  await Like.deleteOne({ post: id });
  await Comment.deleteOne({ post: id });
  res.status(200).json({
    success: true,
    message: "Post deleted",
  });
});

//delete a comment form a specific post
export const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {comId}=req.query;
  const comment = await Comment.findById(id);
  if (!comment) {
    throw new ErrorHandler(404,"Comment not found")
  }
  const post = await Post.findById(comment.post);
  if(!post){
    throw new Error(404, "Post not found")
  }
  const newComments=comment.writtenBy.filter(e=>e._id.toString()!==comId.toString())
  
  comment.writtenBy=newComments;
  await comment.save({validateBeforeSave:false})
  post.comments--;
  await post.save({validateBeforeSave:false})
  res.status(200).json({
    success:false,
    message:"Comment deleted",
    comment
  })
});
