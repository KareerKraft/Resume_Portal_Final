import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Resume from '../models/Resume.js';
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
    return token;
}

//controller for google login
//POST: /api/users/google-login

export const googleLogin = async (req, res) => {
    try {

        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { email, name } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: "google-auth-user",
            });
        }

        const jwtToken = generateToken(user._id);

        user.password = undefined;

        return res.status(200).json({
            message: "Google login successful",
            token: jwtToken,
            user,
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Missing required fields" })
        }
        //create new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name, email, password: hashedPassword
        })



        //return success message
        const token = generateToken(newUser._id)
        newUser.password = undefined;
        return res.status(201).json({
            message: "User created successfully",
            token,
            user: newUser
        })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//controller for user login
//POST: /api/users/login

export const loginUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }
        //check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" })
        }


        //return success message
        const token = generateToken(user._id)
        user.password = undefined;

        return res.status(200).json({
            message: "Login successful",
            token, user
        })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//controller for getting yser by id
//GET: /api/users/data

export const getUserById = async (req, res) => {
    try {
        const userId = req.userId;

        //check if user exists
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        //return user
        user.password = undefined;
        return res.status(200).json({ user })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//controller for getting user resumes

export const getUserResumes = async (req, res) => {
    try {
        const userId = req.userId;

        //return user resumes
        const resumes = await Resume.find({ userId })
        return res.status(200).json({ resumes })
    }
    catch { error } {
        return res.status(400).json({ message: error.message })
    }

}