import userModel from "../models/userSchema.js";
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import 'dotenv/config';

export default async function register(req, res){
    const {username, email, password} = req.body;
    const isAlreadyRegistered = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(isAlreadyRegistered){
        res.status(409).json({
            message:"Username or email already exists"
        })
    }

    const hashed = crypto.createHash("sha256").update(password).digest("hex")

    const user = await userModel.create({
        username,
        email,
        password: hashed
    })
    const token = jwt.sign({
        id:user._id
    }, process.env.JWT_SECRET,{
        expiresIn:"1d"
    })

    res.status(201).json({
        message:"User register successfully",
        user:{
            username:user.name,
            email :user.email
        },
        token
    })
}