import { Request, Response } from "express";
import Quiz from "../models/Quiz.js";
import { Question, Questions } from "types.js";
import { redisClient } from "../utils/redisClient.js";
import HighScore from "../models/highScore.js";

export const selectQuiz = async (req: Request, res: Response) => {
  if (!req.params.slug) {
    return res.status(400).json({ message: "Missing Slug" });
  }

  const quiz = await Quiz.findOne({ Slug: req.params.slug });

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  const questions = quiz.questions;
  questions.sort(() => Math.random() - 0.5);

  if (!req.user?._id)
    return res.status(400).json({ message: "Missing user id" });

  const key = req.user?._id;
  const value = JSON.stringify(questions);

  redisClient.set(key, value).then((res) => {
    console.log(res);
  });
  redisClient.expire(key, 60 * 60).then((res) => {
    console.log(res);
  });

  redisClient.set(key + "-score", 0).then((res) => {
    console.log(res);
  });
  redisClient.expire(key + "-score", 60 * 60).then((res) => {
    console.log(res);
  });

  redisClient.set(key + "-quizSlug", quiz.Slug).then((res) => {
    console.log(res);
  });
  redisClient.expire(key + "-quizSlug", 60 * 60).then((res) => {
    console.log(res);
  });

  return res.status(200).json({
    message:
      "Quiz selected, you have 60 minutes to complete it. Good luck! go to /quiz/question to get the first question of the quiz and /quiz/answer to answer the question",
  });
};

export const getQuestion = async (req: Request, res: Response) => {
  if (!req.user?._id)
    return res.status(400).json({ message: "Missing user id" });
  const key = req.user?._id;

  redisClient.get(key).then((redisRes) => {
    if (!redisRes) return res.status(400).json({ message: "No quiz selected" });
    const questions: Question[] = JSON.parse(redisRes);
    const question: Question = questions[0];

    return res.status(200).json({
      question: question.question,
      Options: question.options,
      questionsLeft: questions.length,
    });
  });
};

export const answerQuestion = async (req: Request, res: Response) => {
  if (!req.user?._id)
    return res.status(400).json({ message: "Missing user id" });
  if (!req.body.answer)
    return res.status(400).json({ message: "Missing answer" });
  const key = req.user?._id;

  if (req.body.answer.length > 1)
    return res
      .status(400)
      .json({ message: "You can only answer one question at a time" });


  if (!req.body.answer.match(/^[a-d]$/))
    return res.status(400).json({ message: "Answer must be a/b/c/d" });

  await redisClient.get(key).then(async (redisRes) => {
    if (!redisRes) return res.status(400).json({ message: "No quiz selected" });
    const questions: Question[] = JSON.parse(redisRes);
    const question = questions[0];

    if (question?.answer === req.body.answer) {
      await redisClient.incr(key + "-score");
      let score = await redisClient.get(key + "-score");

      await shiftArraySetQuestion(questions, key);

      if (questions.length === 0) {
        await saveScore(key, req, score);
        await clearKeys(key);

        return res.status(200).json({
          message: "Correct answer ! You have completed the quiz !",
          score: score,
        });
      }
      return res.status(200).json({
        message:
          "Correct answer ! Go to /quiz/question to get the next question",
        currentScore: score,
        questionsLeft: questions.length,
      });
    } else {
      let score = await redisClient.get(key + "-score");

      await shiftArraySetQuestion(questions, key);

      if (questions.length === 0) {
        await saveScore(key, req, score);
        await clearKeys(key);

        return res.status(200).json({
          message: "Wrong answer ! You have completed the quiz !",
          score: score,
        });
      }

      return res.status(200).json({
        message: "Wrong answer. Go to /quiz/question to get the next question",
        currentScore: score,
        questionsLeft: questions.length,
      });
    }
  });
};
async function saveScore(key: string, req: Request, score: string | null) {
  let quizSlug = await redisClient.get(key + "-quizSlug");

  const highScore = new HighScore({
    quizSlug: quizSlug,
    playerId: req.user?._id,
    score: score,
  });
  await highScore.save();
}

async function clearKeys(key: string) {
  await redisClient.del(key);
  await redisClient.del(key + "-score");
  await redisClient.del(key + "-quizSlug");
}

async function shiftArraySetQuestion(questions: Question[], key: string) {
  questions.shift();
  await redisClient.set(key, JSON.stringify(questions));
  await redisClient.expire(key, 60 * 60);
}
