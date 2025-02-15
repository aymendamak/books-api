import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;
    if (username !== "admin" || password !== "admin") {
      res.status(401).json({ error: "Authentication failed" });
      return;
    }

    if (password === "admin" && username === "admin") {
      const token = jwt.sign({ userId: "admin" }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    }
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
