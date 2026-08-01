import mongoose from "mongoose";

    const studentSchema = mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        age:{
            type: Number,
            required: true,
            min: 1,
        }
    })
    export default mongoose.model('students', studentSchema)