import { Request, Response } from "express";
import Quiz from "../models/Quiz.js";
import slugify from "slugify";
import { Question, Questions } from "types.js";

export const getQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.find({});

    res.status(200).json(quiz);
  } catch (err: any) {
    res.status(404).json({ message: err?.message });
  }
};

export const createQuiz = async (req: Request, res: Response) => {
  if (!req.body.Name || !req.body.questions) {
    return res.status(400).json({ message: "Missing Name or Questions" });
  }

  const quiz: Questions = req.body;

  quiz.Slug = slugify(quiz.Name, { lower: true });

  const newQuiz = new Quiz(quiz);
  try {
    await newQuiz.save();
    res.status(201).json({message:"New Quiz Created", slug: newQuiz.Slug });
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Quiz already exists. Try again with a new name" });
    }
    res.status(409).json({ message: error?.message });
  }
};
