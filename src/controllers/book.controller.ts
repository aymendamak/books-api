import { PrismaClient } from "@prisma/client";
import express from "express";

const bookClient = new PrismaClient().book;

export const getBooks = async (req: express.Request, res: express.Response) => {
  const books = await bookClient.findMany();
  res.status(200).json({ data: books });
};

export const getBookById = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  const book = await bookClient.findUnique({
    where: {
      id: id,
    },
  });
  res.json(book);
};

export const createBook = async (
  req: express.Request,
  res: express.Response
) => {
  const bookData = req.body;
  const book = await bookClient.create({
    data: {
      title: bookData.title,
      author: {
        connect: { id: bookData.authorId },
      },
    },
  });
  res.status(201).json({ data: book });
};

export const updateBookById = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  const bookData = req.body;

  const book = await bookClient.update({
    where: {
      id: id,
    },
    data: bookData,
  });
  res.status(200).json({ data: book });
};

export const deleteBookById = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  await bookClient.delete({
    where: {
      id: id,
    },
  });
  res.status(204).json();
};
