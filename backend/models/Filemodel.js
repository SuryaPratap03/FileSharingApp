import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    path:{
        type: String,
        required:true,
    },
    downloadContent:{
        type:Number,
        required: true,
        default:0
    }
},{timestamps:true})

const file = mongoose.model('file',fileSchema);

export default file;