import prisma from "../../prisma/client";
import { Book } from "@prisma/client";
import express from "express";

export const getBooks = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const books = await prisma.book.findMany();
    res.status(200).json({ data: books });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch books", details: error.message });
  }
};

export const getBookById = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: {
        id: id,
      },
    });

    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.status(200).json({ data: book });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch author", details: error.message });
  }
};

export const createBook = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const bookData = req.body;
  try {
    const book = await prisma.book.create({
      data: {
        title: bookData.title,
        description: bookData.description,
        author: {
          connect: { id: bookData.authorId },
        },
      },
    });
    res.status(201).json({ data: book });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

export const updateBookById = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const bookData = req.body;

    // Check if author exists
    const existingBook = await prisma.book.findUnique({
      where: { id },
    });

    if (!existingBook) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    const book = await prisma.book.update({
      where: { id },
      data: bookData,
    });
    res.status(200).json({ data: book });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update book", details: error.message });
  }
};

export const deleteBookById = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const existingAuthor = await prisma.book.findUnique({
      where: { id },
    });

    if (!existingAuthor) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    await prisma.book.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete author", details: error.message });
  }
};
