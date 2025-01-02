import { Router } from "express";

import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthorById,
  deleteAuthorById,
} from "../controllers/author.controller";

const authoRouter = Router();

authoRouter.get("/", getAuthors);
authoRouter.get("/:id", getAuthorById);
authoRouter.post("/create", createAuthor);
authoRouter.put("/:id", updateAuthorById);
authoRouter.delete("/:id", deleteAuthorById);

export default authoRouter;
