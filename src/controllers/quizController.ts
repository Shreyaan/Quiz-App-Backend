import { Request, Response } from "express";
import Quiz from "../models/Quiz.js";
import slugify from "slugify";
import { Question, Questions } from "types.js";
import sharp, { FormatEnum } from "sharp";
import { storage } from "../utils/firebase-init.js";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

export const getQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.find({});
    let quizListWithoutQuestions = quiz.map((quiz) => {
      return {
        Name: quiz.Name,
        Slug: quiz.Slug,
        created_by: quiz.created_by,
        quizId: quiz._id,
        image: quiz.image,
      };
    });
    res.status(200).json(quizListWithoutQuestions);
  } catch (err: any) {
    res.status(404).json({ message: err?.message });
  }
};

export const uploadImg = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const uploadedFile = req.file;

  if (
    uploadedFile.mimetype !== "image/jpeg" &&
    uploadedFile.mimetype !== "image/png"
  ) {
    return res.status(400).json({ message: "Only jpeg and png files allowed" });
  }

  if (uploadedFile.size > 1000000) {
    return res.status(400).json({ message: "File size too large" });
  }

  const fileName = uploadedFile.originalname.split(".")[0];
  const fileExt = uploadedFile.originalname.split(".")[1];
  if (fileExt !== "png" && fileExt !== "jpg" && fileExt !== "jpeg")
    return res
      .status(400)
      .json({ message: "Only png, jpg and jpeg files allowed" });

  console.log(fileExt, fileName);

  const resizedImg = await sharp(uploadedFile.buffer)
    .webp({ quality: 90 })
    .toBuffer();

  const storageRef = ref(
    storage,
    `images/${fileName}-${Date.now()}` + "." + "webp"
  );
  const uploadTask = await uploadString(
    storageRef,
    resizedImg.toString("base64"),
    "base64"
  );
  const downloadURL = await getDownloadURL(uploadTask.ref);
  res.status(200).json({ message: "Image uploaded", url: downloadURL });
};

export const createQuiz = async (req: Request, res: Response) => {
  if (!req.body.Name || !req.body.questions) {
    return res.status(400).json({ message: "Missing Name or Questions" });
  }

  const quiz: Questions = req.body;

  if (quiz.questions.length < 5) {
    return res.status(400).json({ message: "Minimum 5 questions required" });
  }

  if (quiz.questions.length > 50) {
    return res.status(400).json({ message: "Maximum 50 questions allowed" });
  }

  quiz.Slug = slugify(quiz.Name, { lower: true });

  if (req.user?.username) quiz.created_by = req.user.username;

  const newQuiz = new Quiz(quiz);
  try {
    await newQuiz.save();
    res.status(201).json({ message: "New Quiz Created", slug: newQuiz.Slug });
  } catch (error: any) {
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ message: "Quiz already exists. Try again with a new name" });
    }
    res.status(409).json({ message: error?.message });
  }
};

export const getQuizBySlug = async (req: Request, res: Response) => {
  if (!req.params.slug) {
    return res.status(400).json({ message: "Missing Slug" });
  }

  const quiz = await Quiz.findOne({ Slug: req.params.slug });

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }
  let questions: Question[] = quiz.questions;
  questions = questions.map((question) => {
    return {
      question: question.question,
      options: question.options,
    };
  });
  let quizListWithoutQuestions = {
    Name: quiz.Name,
    Slug: quiz.Slug,
    created_by: quiz.created_by,
    quizId: quiz._id,
    image: quiz.image,
    questions,
  };
  return res.status(200).json(quizListWithoutQuestions);
};

export const updateQuiz = async (req: Request, res: Response) => {
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

  if (req.user?.username !== quiz.created_by) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const updatedQuiz = await Quiz.findOneAndUpdate(
    { Slug: req.params.slug },
    req.body,
    { new: true }
  );

  return res.status(200).json(updatedQuiz);
};

export const deleteQuiz = async (req: Request, res: Response) => {
  if (!req.params.slug) {
    return res.status(400).json({ message: "Missing Slug" });
  }

  const quiz = await Quiz.findOne({ Slug: req.params.slug });

  if (!quiz) {
    return res.status(404).json({ message: "Quiz not found" });
  }

  if (req.user?.username !== quiz.created_by) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await Quiz.findOneAndDelete({ Slug: req.params.slug });

  return res.status(200).json({ message: "Quiz deleted successfully" });
};
