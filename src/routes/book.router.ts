import { Router } from "express";

import {
  getBooks,
  getBookById,
  createBook,
  updateBookById,
  deleteBookById,
} from "../controllers/book.controller";

const bookRouter = Router();

bookRouter.get("/", getBooks);
bookRouter.get("/:id", getBookById);
bookRouter.post("/create", createBook);
bookRouter.put("/:id", updateBookById);
bookRouter.delete("/:id", deleteBookById);

export default bookRouter;
