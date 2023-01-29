import { auth } from "../utils/firebase-init.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { UserModel } from "types.js";

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Missing email, password or name" });
  }

  // Check if user already exists
  User.findOne({ email }, (err: { message: any }, existingUser: any) => {
    if (err) return res.status(500).json({ message: err.message });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });
  });

  createUserWithEmailAndPassword(auth, email, password)
    .then((user) => {
      // Store the user's data in MongoDB
      const newUser = new User({
        id: user.user?.uid,
        email: email,
        name: name,
      });
      newUser.save((err) => {
        if (err) return res.status(500).json({ message: err.message });
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

export const login = async (req: Request, res: Response) => {
  // Validate the input fields
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }
  let userObj: UserModel;

  signInWithEmailAndPassword(auth, email, password)
    .then(async (userCred) => {
      try {
        const token = await userCred.user.getIdToken();
        // check if user exists in our DB
        User.findOne(
          { email: email },
          (err: { message: any }, user: UserModel) => {
            if (err) return res.status(500).json({ message: err.message });
            if (!user)
              return res.status(404).json({ message: "User not found" });
            // create JWT
            userObj = user;
            let jwtSecret = process.env.JWT_SECRET as string;
            jwt.sign({ user }, jwtSecret, (_err: any, token: any) => {
              if (_err) return res.status(500).json({ message: _err.message });
              return res.json({
                token,
                role: userObj.role,
                email: userObj.email,
                name: userObj.name,
              });
            });
          }
        );
      } catch (error) {
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

export const forgotPassword = async (req: Request, res: Response) => {
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

export const showProfile = async (req: Request, res: Response) => {
  const { _id } = req.params;

  if (!_id) {
    return res.status(400).json({ message: "Missing id" });
  }

  User.findOne({ _id }, (err: { message: any }, user: UserModel) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ name : user.name, role : user.role });
  });
};
