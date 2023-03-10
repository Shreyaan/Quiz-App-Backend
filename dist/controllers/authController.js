import { auth } from "../utils/firebase-init.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, } from "firebase/auth";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
export const signup = async (req, res) => {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
        return res
            .status(400)
            .json({ message: "Missing email, password or username" });
    }
    // Check if user already exists
    User.findOne({ email }, (err, existingUser) => {
        if (err)
            return res.status(500).json({ message: err.message });
        if (existingUser)
            return res.status(400).json({ message: "Email already in use" });
    });
    User.findOne({ username: username }, (err, existingUser) => {
        if (err)
            return res.status(500).json({ message: err.message });
        if (existingUser)
            return res.status(400).json({ message: "Username already in use" });
    });
    createUserWithEmailAndPassword(auth, email, password)
        .then((user) => {
        // Store the user's data in MongoDB
        const newUser = new User({
            id: user.user?.uid,
            email: email,
            username: username,
        });
        newUser.save((err) => {
            if (err)
                return res.status(500).json({ message: err.message });
            return res.status(201).json({ message: "User created successfully" });
        });
    })
        .catch((error) => {
        if (!res.headersSent)
            return res
                .status(500)
                .json({ error: error.code, message: error.message });
    });
};
export const login = async (req, res) => {
    // Validate the input fields
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
    }
    let userObj;
    signInWithEmailAndPassword(auth, email, password)
        .then(async (userCred) => {
        try {
            const token = await userCred.user.getIdToken();
            // check if user exists in our DB
            User.findOne({ email: email }, (err, user) => {
                if (err)
                    return res.status(500).json({ message: err.message });
                if (!user)
                    return res.status(404).json({ message: "User not found" });
                // create JWT
                userObj = user;
                let jwtSecret = process.env.JWT_SECRET;
                jwt.sign({ user }, jwtSecret, (_err, token) => {
                    if (_err)
                        return res.status(500).json({ message: _err.message });
                    return res.json({
                        token,
                        role: userObj.role,
                        email: userObj.email,
                        username: userObj.username,
                    });
                });
            });
        }
        catch (error) {
            console.log(error);
            if (!res.headersSent)
                return res.status(401).json({ message: "Unauthorized" });
        }
    })
        .catch((error) => {
        console.log(error);
        if (!res.headersSent)
            return res.status(401).json({ message: error.message });
    });
};
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Missing email" });
    }
    sendPasswordResetEmail(auth, email)
        .then(() => {
        return res.status(200).json({ message: "Password reset email sent" });
    })
        .catch((error) => {
        if (!res.headersSent)
            return res
                .status(500)
                .json({ error: error.code, message: error.message });
    });
};
//show user profile
export const showProfile = async (req, res) => {
    const { _id } = req.params;
    if (!_id) {
        return res.status(400).json({ message: "Missing id" });
    }
    User.findOne({ _id }, (err, user) => {
        if (err)
            return res.status(500).json({ message: err.message });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ username: user.username, role: user.role });
    });
};
//# sourceMappingURL=authController.js.map