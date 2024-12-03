import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { uploads } from './middleware/upload.js';
import file from './models/filemodel.js';
import path from 'path';
import fs from 'fs';
import { configDotenv } from 'dotenv';
configDotenv();

const app = express();

const PORT =3000;
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log('Mongodb Connected');
})
.catch((error)=>{
    console.log(error); 
})

app.use(cors({
    origin:'http://localhost:5173',
    credentials:'include',
}))

app.post('/upload',uploads.single('file'),async(req,res)=>{
    console.log('req.file',req?.file);
    const {originalname,path} = req?.file;
    const newfile = await file({name:originalname,path:path});
    newfile.save();
    return res.status(200).json({message : 'File uploaded successfully',success:true,file : newfile,path:`http://localhost:3000/file/${newfile._id}`});
})

app.get('/file/:id',async(req,res)=>{
    try{
        const id = await req.params.id;
        const newfile = await file.findById(id);
        newfile.downloadContent++;
        newfile.save();
        res.download(newfile.path,newfile.name);

        // const absolutePath = path.resolve(newfile.path);
        // const fileStream = fs.createReadStream(absolutePath);
        // fileStream.pipe(res);
    }catch(error){
        return res.status(500).json({error:error});
    }
})

app.listen(PORT,()=>console.log(`Server started at ${PORT}`)
)
