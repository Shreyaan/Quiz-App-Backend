import { JwtPayload } from "jsonwebtoken";

export interface UserModel {
  email: string;
  role: "user" | "admin";
  created_at: Date;
  password?: string | undefined;
  name?: string | undefined;
  id?: string | undefined;
  updated_at?: Date | undefined;
  _id: string;
}

export interface Question {
    question: string;
    options: {
      a: string;
      b: string;
      c: string;
      d: string;
    };
    answer: string;
  }
  
  export interface Questions {
    Name: string;
    Slug: string;
    created_by: string;
    questions: Question[];
  }
  

 export interface Decoded extends JwtPayload {
    user: UserModel;
}

declare global {
  namespace Express {
   export interface Request {
      user?: UserModel;
    }
  }
}