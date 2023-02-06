import { Router } from "express";
import multer from "multer";
import { createQuiz, getQuiz, updateQuiz, getQuizBySlug, deleteQuiz, uploadImg } from "../controllers/quizController.js";
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
router.get('/', getQuiz);
router.post('/upload', upload.single('image'), uploadImg);
router.post('/new', createQuiz);
router.get('/:slug', getQuizBySlug);
router.put('/:slug', updateQuiz);
router.delete('/:slug', deleteQuiz);
export default router;
//# sourceMappingURL=quiz.js.map