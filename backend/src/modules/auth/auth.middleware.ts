import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "./auth.interface";

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret";

export const createToken = (email?: string) => {
  return jwt.sign({ email }, JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "6d",
  });
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ message: "Token não fornecido" });
    return;
  }

  try {
    const decoded = jwt.verify(authorization, JWT_SECRET) as TokenPayload;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
