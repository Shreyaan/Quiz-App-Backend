import Quiz from "../models/Quiz.js";
import slugify from "slugify";
export const getQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.find({});
        res.status(200).json(quiz);
    }
    catch (err) {
        res.status(404).json({ message: err?.message });
    }
};
export const createQuiz = async (req, res) => {
    if (!req.body.Name || !req.body.questions) {
        return res.status(400).json({ message: "Missing Name or Questions" });
    }
    const quiz = req.body;
    quiz.Slug = slugify(quiz.Name, { lower: true });
    const newQuiz = new Quiz(quiz);
    try {
        await newQuiz.save();
        res.status(201).json({ message: "New Quiz Created", slug: newQuiz.Slug });
    }
    catch (error) {
        if (error.code === 11000) {
            return res
                .status(409)
                .json({ message: "Quiz already exists. Try again with a new name" });
        }
        res.status(409).json({ message: error?.message });
    }
};
//# sourceMappingURL=quizController.js.map