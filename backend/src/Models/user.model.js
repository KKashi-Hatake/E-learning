import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'



const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "Name is required"],
        trim:true,
        minLength:[4,'Name must have minimum 4 characters'],
        maxLength:[30, 'Name can not have more than 30 characters in it']
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate:[validator.isEmail, 'Please enter a valid email']
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    avatar:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
        next()
    } else {
        return next()
    }
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = async function () {
    return await jwt.sign({
        _id: this._id,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}







export const User = mongoose.model("User", userSchema)