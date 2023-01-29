import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Decoded, UserRequest, UserModel } from "types";

export const checkToken = async (
  req: Request ,
  res: Response,
  next: NextFunction
) => {
  const headers = req.headers;
  let token = (headers as any)["x-access-token"] || (headers as any)["authorization"] || (headers as any)["Authorization"];

  
  // Check if no token was provided
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Remove Bearer from string
    if (typeof token !== "string")
      return res.status(400).json({ message: "Invalid token." });
    const bearer = token.split(" ");
    const bearerToken = bearer[1];
    token = bearerToken;

    // Verify the token
    if (!process.env.JWT_SECRET)
      return res.status(500).json({ message: "Internal server error" });
    const decoded: Decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as Decoded;
   //add key user to req

   
   


    // req.user = decoded.user;

    next();
  } catch (error) {
    if (!res.headersSent)
      return res.status(400).json({ message: "Invalid token." });
  }
};
