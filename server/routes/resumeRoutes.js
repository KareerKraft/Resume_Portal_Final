import express from "express";
import protect from "../middlewares/authMiddleware.js";   // ✅ added .js

import {
    createResume,
    deleteResume,
    getResumeById,
    getPublicResumeById,
    updateResume
} from "../controllers/resumeController.js";   // ✅ fixed imports

import upload from "../configs/multer.js";   // ✅ added .js

const resumeRouter = express.Router();

// Debug middleware
const debugMiddleware = (req, res, next) => {
    console.log("Request received:", {
        method: req.method,
        path: req.path,
        hasFile: !!req.file,
        fileFieldname: req.file?.fieldname,
        bodyKeys: Object.keys(req.body || {})
    });
    next();
};

// Create Resume
resumeRouter.post('/create', protect, createResume);

// Update Resume
resumeRouter.put(
    '/update',
    upload.single('image'),   // upload middleware
    debugMiddleware,           // debug middleware
    protect,
    updateResume
);

// Delete Resume
resumeRouter.delete('/delete/:resumeId', protect, deleteResume);

// Get Resume (Private)
resumeRouter.get('/get/:resumeId', protect, getResumeById);

// Get Resume (Public)
resumeRouter.get('/public/:resumeId', getPublicResumeById);

export default resumeRouter;
