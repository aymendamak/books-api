import { NextFunction, Request, Response } from "express";

const expressValidator = require("express-validator");

export const createBookValidator = [
  expressValidator
    .body("title")
    .notEmpty()
    .withMessage("The Book title should not be empty"),
  expressValidator
    .body("description")
    .notEmpty()
    .withMessage("The Description should not be empty"),
  expressValidator
    .body("authorId")
    .notEmpty()
    .withMessage("The book should have an author"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
