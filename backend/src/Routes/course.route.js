import {Router} from 'express'
import {isAuthenticatedUser} from '../Middlewares/auth.js'
import { createCourse, deleteCourse, getAllCourses, getSingleCourse, updateCourse } from '../Controllers/course.controller.js';
import {upload} from '../Middlewares/multer.middleware.js'



const router  = Router();

router.route('/all').get(getAllCourses)
router.route('/:id').get(getSingleCourse)
router.route('/new').post(isAuthenticatedUser, upload.fields([
    {
        name: "videoFile",
        maxCount: 1,
    },
    {
        name: "coverImage",
        maxCount: 1,
    },
    
]),createCourse)
router.route('/update/:id').put(isAuthenticatedUser,updateCourse)
router.route('/delete/:id').delete(isAuthenticatedUser,deleteCourse)





export default router