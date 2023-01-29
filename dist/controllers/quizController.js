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
    if (req.user?._id)
        quiz.created_by = req.user._id;
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
export const getQuizBySlug = async (req, res) => {
    if (!req.params.slug) {
        return res.status(400).json({ message: "Missing Slug" });
    }
    const quiz = await Quiz.findOne({ Slug: req.params.slug });
    if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
    }
    return res.status(200).json(quiz);
};
export const updateQuiz = async (req, res) => {
    if (!req.params.slug) {
        return res.status(400).json({ message: "Missing Slug" });
    }
    if (!req.body.Name && !req.body.questions) {
        return res.status(400).json({ message: "Missing Name or Questions" });
    }
    const quiz = await Quiz.findOne({ Slug: req.params.slug });
    if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
    }
    if (req.user?._id !== quiz.created_by) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const updatedQuiz = await Quiz.findOneAndUpdate({ Slug: req.params.slug }, req.body, { new: true });
    return res.status(200).json(updatedQuiz);
};
export const deleteQuiz = async (req, res) => {
    if (!req.params.slug) {
        return res.status(400).json({ message: "Missing Slug" });
    }
    const quiz = await Quiz.findOne({ Slug: req.params.slug });
    if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
    }
    if (req.user?._id !== quiz.created_by) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    await Quiz.findOneAndDelete({ Slug: req.params.slug });
    return res.status(200).json({ message: "Quiz deleted successfully" });
};
//# sourceMappingURL=quizController.js.map