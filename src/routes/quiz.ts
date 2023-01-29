import { Router } from "express";

import { createQuiz,getQuiz,updateQuiz,getQuizBySlug,deleteQuiz } from "../controllers/quizController.js";
const router = Router();


router.get('/', getQuiz);
router.post('/new', createQuiz);
router.get('/:slug', getQuizBySlug);
router.put('/:slug', updateQuiz);
router.delete('/:slug', deleteQuiz);


export default router;
