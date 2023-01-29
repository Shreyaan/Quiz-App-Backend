import express, { Request, Response } from "express";
import { Router } from "express";

import {forgotPassword,login,signup} from "../controllers/authController.js";

const router = Router();

router.post('/register', signup);
router.post('/login', login);
router.post('/forgot', forgotPassword);
// router.get('/profile', authController.getProfile);

export default router;
