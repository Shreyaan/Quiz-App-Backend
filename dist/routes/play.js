import { Router } from "express";
import { answerQuestion, getQuestion, selectQuiz } from "../controllers/playControllers.js";
const router = Router();
router.get('/select/:slug', selectQuiz);
router.get('/question', getQuestion);
router.post('/answer', answerQuestion);
export default router;
//# sourceMappingURL=play.js.map