import { Router } from "express";

import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthorById,
  deleteAuthorById,
} from "../controllers/author.controller";
import { createAuthorValidator } from "../middlewares/author-validation";
import { verifyToken } from "../middlewares/auth";
const authorRouter = Router();

authorRouter.get("/", getAuthors);
authorRouter.get("/:id", verifyToken, getAuthorById);
authorRouter.post("/create", verifyToken, createAuthorValidator, createAuthor);
authorRouter.put("/:id", verifyToken, updateAuthorById);
authorRouter.delete("/:id", verifyToken, deleteAuthorById);

export default authorRouter;
