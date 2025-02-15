import express from "express";
import cors from "cors";

import authorRouter from "./routes/author.router";
import bookRouter from "./routes/book.router";
import authRouter from "./routes/auth.router";

import logger from "./middlewares/logger";

const app = express();
const port = process.env.PORT || 8081;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.use((err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`);
  res.status(500).send("Internal Server Error");
});

app.use("/authors", authorRouter);
app.use("/books", bookRouter);
app.use("/auth", authRouter);

app.get("/ping", (req, res) => {
  res.json({ message: "pong" }).status(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
