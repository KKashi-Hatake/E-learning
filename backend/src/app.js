import express from 'express'
import userRouter from './Routes/user.route.js'
import courseRouter from './Routes/course.route.js'
import postRouter from './Routes/post.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'


const app =express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods:['GET','POST','DELETE','PUT'],
    credentials: true
}))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.json({ limit: "16kb" }))
app.use(cookieParser())

app.use('/api/v1/user',userRouter)
app.use('/api/v1/course',courseRouter)
app.use('/api/v1/post',postRouter)

export default app