import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).json({ error: "Access denied" });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
