import { Router } from "express";
import { forgotPassword, login, signup, showProfile } from "../controllers/authController.js";
import { checkToken } from "../middleware/auth.js";
const router = Router();
router.post('/register', signup);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.get('/profile/:_id', checkToken, showProfile);
export default router;
//# sourceMappingURL=auth.js.map