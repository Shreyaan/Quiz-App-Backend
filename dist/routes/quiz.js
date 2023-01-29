import { Router } from "express";
import { createQuiz, getQuiz } from "../controllers/quizController.js";
const router = Router();
// router.post('/register', signup);
// router.post('/login', login);
// router.post('/forgot', forgotPassword);
// router.get('/profile', authController.getProfile);
router.get('/', getQuiz);
router.post('/new', createQuiz);
export default router;
//# sourceMappingURL=quiz.js.map