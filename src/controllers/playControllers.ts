import { Request, Response } from "express";
import Quiz from "../models/Quiz.js";
import { Question, Questions } from "types.js";
import { redisClient } from "../utils/redisClient.js";

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

    return res
      .status(200)
      .json({ question: question.question, Options: question.options });
  });
};

export const answerQuestion = async (req: Request, res: Response) => {
  if (!req.user?._id)
    return res.status(400).json({ message: "Missing user id" });
  if (!req.body.answer)
    return res.status(400).json({ message: "Missing answer" });
  const key = req.user?._id;

  redisClient.get(key).then((redisRes) => {
    if (!redisRes) return res.status(400).json({ message: "No quiz selected" });
    const questions: Question[] = JSON.parse(redisRes);
    const question = questions[0];

    if (question.answer === req.body.answer) {
      redisClient.incr(key + "-score").then((res) => {
        console.log(res);
      });

      let score = redisClient.get(key + "-score");
      redisClient.del(key + "-score").then((res) => {
        console.log(res);
      });
      questions.shift();
      redisClient.set(key, JSON.stringify(questions)).then((res) => {
        console.log(res);
      });
      if (questions.length === 0) {
        redisClient.del(key).then((res) => {
          console.log(res);
        });

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
      let score = redisClient.get(key + "-score");

      questions.shift();

      redisClient.set(key, JSON.stringify(questions)).then((res) => {
        console.log(res);
      });

      if (questions.length === 0) {
        redisClient.del(key).then((res) => {
          console.log(res);
        });

        redisClient.del(key + "-score").then((res) => {
          console.log(res);
        });

        return res.status(200).json({
          message: "Wrong answer ! You have completed the quiz !",
          score: score,
        });
      }

      return res.status(400).json({ message: "Wrong answer" });
    }
  });
};
