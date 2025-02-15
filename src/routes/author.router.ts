import { Router } from "express";

import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthorById,
  deleteAuthorById,
} from "../controllers/author.controller";
import { createAuthorValidator } from "../middleware/author-validation.middleware";

const authorRouter = Router();

authorRouter.get("/", getAuthors);
authorRouter.get("/:id", getAuthorById);
authorRouter.post("/create", createAuthorValidator, createAuthor);
authorRouter.put("/:id", updateAuthorById);
authorRouter.delete("/:id", deleteAuthorById);

export default authorRouter;
