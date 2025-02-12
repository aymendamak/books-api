import { Router } from "express";

import {
  getBooks,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
} from "../controllers/book.controller";
import { createBookValidator } from "../validators/book";

const bookRouter = Router();

bookRouter.get("/", getBooks);
bookRouter.get("/:id", getBookById);
bookRouter.post("/create", createBookValidator, createBook);
bookRouter.put("/:id", updateBookById);
bookRouter.delete("/:id", deleteBookById);

export default bookRouter;
