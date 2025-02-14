import { Router } from "express";

import {
  getBooks,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
} from "../controllers/book.controller";
import { createBookValidator } from "../middleware/book-validation.middleware";

const bookRouter = Router();

bookRouter.get("/", getBooks);
bookRouter.get("/:id", getBookById);
bookRouter.post("/create", createBookValidator, createBook);
bookRouter.put("/:id", updateBookById);
bookRouter.delete("/:id", deleteBookById);

export default bookRouter;
