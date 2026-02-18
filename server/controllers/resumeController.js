import imagekit from "../configs/imagekit.js";
import Resume from "../models/Resume.js";
import { Readable } from 'stream';

export const createResume = async (req, res) => {
    try {
        const userId = req.userId;

        const { title } = req.body;

        // create new resume
        const newResume = await Resume.create({ userId, title });

        return res.status(201).json({
            message: 'Resume created successfully',
            resume: newResume
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

//Controller for deleting resume
//DELETE: /api/resumes/delete

export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId } = req.params;

        await Resume.findOneAndDelete({ userId, _id: resumeId });

        return res.status(200).json({
            message: 'Resume deleted successfully'
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


//get user resume by id

export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;

        // support both route param and body
        const resumeId = req.params.resumeId || req.body.resumeId;

        // create new resume
        const resume = await Resume.findOne({ userId, _id: resumeId })

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" })
        }
        resume._v = undefined;
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        return res.status(200).json({ resume })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
};

//get resume by Id public
//GET: /api/resumes/public

export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({ public: true, _id: resumeId })

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" })
        }

        return res.status(200).json({ resume })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

///controller for updating a resume
//PUT: /api/resumes/update

export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        let { resumeId, resumeData, removeBackground } = req.body;
        const image = req.file;

        console.log("Update Resume Request:", { 
            resumeId, 
            removeBackground, 
            hasImage: !!image,
            imageSize: image?.size,
            imageBuffer: image?.buffer ? 'exists' : 'missing'
        });

        // Validate resumeId
        if (!resumeId) {
            return res.status(400).json({ message: "resumeId is required" });
        }

        // Parse resumeData if it's a string (from FormData)
        if (typeof resumeData === 'string') {
            try {
                resumeData = JSON.parse(resumeData);
            } catch (parseError) {
                console.error("Failed to parse resumeData:", parseError);
                return res.status(400).json({ message: "Invalid resumeData format" });
            }
        }

        // Don't copy, just use the parsed data
        let updateData = resumeData;

        // Handle image upload to ImageKit
        if (image && image.buffer && image.buffer.length > 0) {
            try {
                console.log("Uploading image to ImageKit:", {
                    bufferLength: image.buffer.length,
                    mimetype: image.mimetype,
                    originalname: image.originalname
                });
                
                // Get file extension from originalname
                const fileExt = image.originalname.split('.').pop() || 'jpg';
                const fileName = `resume-${Date.now()}.${fileExt}`;
                
                // Create readable stream from buffer
                const stream = Readable.from([image.buffer]);
                
                const response = await imagekit.files.upload({
                    file: stream,
                    fileName: fileName,
                });

                console.log("ImageKit upload successful:", response.url);

                if (updateData.personal_info) {
                    updateData.personal_info.image = response.url;
                }
            } catch (uploadError) {
                console.error("ImageKit upload error:", uploadError);
                console.error("Error message:", uploadError.message);
                console.error("Error status:", uploadError.statusCode);
                return res.status(400).json({ 
                    message: "Image upload failed: " + uploadError.message 
                });
            }
        } else if (image) {
            console.warn("Image file received but buffer is missing/empty", {
                hasBuffer: !!image.buffer,
                bufferLength: image.buffer?.length
            });
        }

        // Update resume in database
        const resume = await Resume.findOneAndUpdate(
            { _id: resumeId, userId },
            updateData,
            { new: true, runValidators: false }
        );

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        console.log("Resume updated successfully");

        return res.status(200).json({
            message: "Resume updated successfully",
            resume
        });

    } catch (error) {
        console.error("Update resume error:", error);
        return res.status(400).json({ message: error.message });
    }
}