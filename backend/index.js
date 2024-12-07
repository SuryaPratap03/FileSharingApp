import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { uploads } from './middleware/upload.js';
import file from './models/Filemodel.js';
import path from 'path';
import { configDotenv } from 'dotenv';
configDotenv();

const app = express();

const PORT = process.env.PORT || 3000;

// MongoDB Connection with Error Handling
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((error) => {
    console.error('MongoDB Connection Failed:', error.message);
  });

// Enable CORS
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.get('/',(req,res)=>{
  res.send('<h1>hello world</h1>');
})


// File Upload Route
app.post('/upload', uploads.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { originalname, path: filePath } = req.file;

    const newFile = new file({ name: originalname, path: filePath });
    await newFile.save();

    res.status(200).json({
      message: 'File uploaded successfully', 
      success: true, 
      file: newFile,
      path: `${process.env.BACKEND_URL}/file/${newFile._id}`,
    });
  } catch (error) {
    console.error('Error in File Upload:', error.message);
    res.status(500).json({ success: false, error: 'Failed to upload file' });
  }
});

// File Download Route
app.get('/file/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const newFile = await file.findById(id);

    if (!newFile) {
      return res.status(404).json({ success: false, error: 'File not found' });
    }

    // Increment the download count
    newFile.downloadContent++;
    await newFile.save();

    // Serve the file for download
    const absolutePath = path.resolve(newFile.path);
    res.download(absolutePath, newFile.name, (err) => {
      if (err) {
        console.error('Error in File Download:', err.message);
        res.status(500).json({ success: false, error: 'Failed to download file' });
      }
    });
  } catch (error) {
    console.error('Error in File Download Route:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch file' });
  }
});

// Global Error Handling Middleware (Optional)
app.use((err, req, res, next) => {
  console.error('Unexpected Error:', err.message);
  res.status(500).json({ success: false, error: 'An unexpected error occurred' });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
