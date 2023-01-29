import { JwtPayload } from "jsonwebtoken";

export interface UserModel {
  email: string;
  role: "user" | "admin";
  created_at: Date;
  password?: string | undefined;
  name?: string | undefined;
  id?: string | undefined;
  updated_at?: Date | undefined;
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
    questions: Question[];
  }
  

 export interface Decoded extends JwtPayload {
    user: UserModel;
}

interface UserRequest extends Request {
  user?: any;
}