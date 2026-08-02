import userModel from "../models/userSchema.js";
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import 'dotenv/config';
import sessionModel from "../models/sessionSchema.js";

export async function register(req, res){
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

    const refreshToken = jwt.sign({
        id:user._id
    }, process.env.JWT_SECRET,{
        expiresIn:"15d"
    })

    const session = await sessionModel.create({
        userId:user._id,
        refreshTokenHash:crypto.createHash("sha256").update(refreshToken).digest("hex"),
        ip:req.ip,
        userAgent:req.headers['user-agent']
    })

    const accessToken = jwt.sign({
        id:user._id,
        sessionId:session._id
    }, process.env.JWT_SECRET,{
        expiresIn:"15m"
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days
    })

    res.status(201).json({
        message:"User register successfully",
        user:{
            username:user.name,
            email :user.email
        },
        accessToken
    })
}

export async function login(req, res){
    const {username, password} = req.body;
    const hashed = crypto.createHash("sha256").update(password).digest("hex")
    const user = await userModel.findOne({username, password:hashed})
    if(!user){
        return res.status(401).json({
            message:"Invalid username or password"
        })
    }
    
    const refreshToken = jwt.sign({
        id:user._id
    }, process.env.JWT_SECRET,{
        expiresIn:"15d"
    })

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")
    const session = await sessionModel.create({
        userId:user._id,
        refreshTokenHash,
        ip:req.ip,
        userAgent:req.headers['user-agent']
    })
    const accessToken = jwt.sign({
        id:user._id,
        sessionId:session._id
    }, process.env.JWT_SECRET,{
        expiresIn:"15m"
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days
    })
    res.status(200).json({
        message:"User logged in successfully",
        user:{
            username:user.name,
            email :user.email
        },
        accessToken
    })
}


export async function getUser(req, res) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Token not provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user
        });

    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}


export async function refreshToken(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not provided"
            });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
        const session = await sessionModel.findOne({ refreshTokenHash, revoked: false });
        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        const accessToken = jwt.sign({
            id: decoded.id
        }, process.env.JWT_SECRET, {
            expiresIn: "15m"
        });
        return res.status(200).json({
            message: "Access token refreshed successfully",
            accessToken
        }); 
        const newRefreshToken = jwt.sign({
            id: decoded.id
        }, process.env.JWT_SECRET, {
            expiresIn: "15d"
        });

        const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
        session.refreshTokenHash = newRefreshTokenHash;
        await session.save();

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 24 * 60 * 60 * 1000 // 15 days
        });
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}


export async function logout(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not provided"
            });
        }
        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
        const session = await sessionModel.findOne({ refreshTokenHash, revoked: false});
        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }
        session.revoked = true;
        await session.save();
        res.clearCookie("refreshToken");
        return res.status(200).json({
            message: "Logged out successfully"
        });
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}


export async function logoutAll(req, res) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token not provided"
            });
        }
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        await sessionModel.updateMany({ userId: decoded.id, revoked: false }, { revoked: true });
        res.clearCookie("refreshToken");
        return res.status(200).json({
            message: "Logged out from all sessions successfully"
        });
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
}