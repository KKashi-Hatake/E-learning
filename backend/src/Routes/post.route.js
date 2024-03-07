import  {Router} from 'express';
import {isAuthenticatedUser} from '../Middlewares/auth.js'
import { addComments, createPost, updateLikes, addReply, getAllPosts, getAllComments, deletePost, deleteComment } from '../Controllers/post.controller.js';
import {upload} from '../Middlewares/multer.middleware.js'


const router =Router();

router.route('/').get(getAllPosts)
router.route('/:id').get(getAllComments)


router.route('/new').post(isAuthenticatedUser, upload.single('file'), createPost)
router.route('/likes/:id').post(isAuthenticatedUser, updateLikes)
router.route('/comments/:id').post(isAuthenticatedUser, addComments).delete(isAuthenticatedUser, deleteComment)
router.route('/reply/:id').post(isAuthenticatedUser, addReply)

router.route('/:id').delete(isAuthenticatedUser,deletePost)






export default router