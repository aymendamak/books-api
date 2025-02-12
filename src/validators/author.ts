import { NextFunction, Request, Response } from "express";

const expressValidator = require("express-validator");

export const createAuthorValidator = [
  expressValidator
    .body("name")
    .notEmpty()
    .withMessage("The Author name should not be empty"),
  expressValidator
    .body("biography")
    .notEmpty()
    .withMessage("Biography should not be empty"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = expressValidator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
