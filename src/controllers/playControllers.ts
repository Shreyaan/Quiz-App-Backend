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

  if (!req.user?.username)
    return res.status(400).json({ message: "Missing user id" });

  const key = req.user?.username;
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
  if (!req.user?.username)
    return res.status(400).json({ message: "Missing user id" });
  const key = req.user?.username;

  redisClient.get(key).then(async (redisRes) => {
    if (!redisRes) return res.status(400).json({ message: "No quiz selected" });
    const questions: Question[] = JSON.parse(redisRes);
    const question: Question = questions[0];


    if (!question) {
      return res.status(400).json({ message: "No questions left" });
    }

    let quizSlug = await redisClient.get(key + "-quizSlug");

    return res.status(200).json({
      quizSlug: quizSlug,
      question: question.question,
      Options: question.options,
      questionsLeft: questions.length,
    });
  });
};

export const answerQuestion = async (req: Request, res: Response) => {  
  if (!req.user?.username)
    return res.status(400).json({ message: "Missing username" });
  if (!req.body.answer)
    return res.status(400).json({ message: "Missing answer" });
  const key = req.user?.username;

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

    let responseObj: {
      message: string;
      isCorrect: boolean;
      currentScore?: string;
      questionsLeft?: number;
      score?: string;
    };
    let quizSlug = req.body.quizSlug;
    if (question?.answer === req.body.answer) {
      await redisClient.incr(key + "-score");
      let score = await redisClient.get(key + "-score");

      await shiftArraySetQuestion(questions, key);

      if (questions.length === 0) {
        await saveScore(key, req, score, quizSlug);
        await clearKeys(key);
        responseObj = {
          message: "Correct answer ! You have completed the quiz !",
          isCorrect: true,
          score: score ? score : "0",
        };
        return res.status(200).json(responseObj);
      }

      responseObj = {
        message:
          "Correct answer.",
        isCorrect: true,
        currentScore: score ? score : "0",
        questionsLeft: questions.length,
      };

      return res.status(200).json(responseObj);
    } else {
      let score = await redisClient.get(key + "-score");

      await shiftArraySetQuestion(questions, key);

      if (questions.length === 0) {
        await saveScore(key, req, score, quizSlug);
        await clearKeys(key);

        responseObj = {
          message: "Wrong answer ! You have completed the quiz !",
          isCorrect: false,
          score: score ? score : "0",
        };

        return res.status(200).json(responseObj);
      }

      responseObj = {
        message: "Wrong answer.",
        isCorrect: false,
        currentScore: score ? score : "0",
        questionsLeft: questions.length,
      };

      return res.status(200).json(responseObj);
    }
  });
};
async function saveScore(key: string, req: Request, score: string | null, quizSlug: string| null) {
 console.log(quizSlug);
 if (!quizSlug) {
   quizSlug = await redisClient.get(key + "-quizSlug");
  }

  if(!quizSlug) return 



 try {
   const highScore = new HighScore({
     quizSlug: quizSlug,
     playerName: req.user?.username,
     score: score,
   });
   await highScore.save();
 } catch (error) {
  console.log(error);
  
 }
  console.log("score saved");
  
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
