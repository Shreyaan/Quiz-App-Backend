import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Slug: {
    type: String,
    required: true,
    unique: true,
  },
  created_by: {
    type: String,
    required: true,
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: {
        a: {
          type: String,
          required: true,
        },
        b: {
          type: String,
          required: true,
        },
        c: {
          type: String,
          required: true,
        },
        d: {
          type: String,
          required: true,
        },
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.model("Quiz", QuizSchema);
