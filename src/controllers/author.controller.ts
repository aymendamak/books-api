import { Author } from "@prisma/client";
import express from "express";
import prisma from "../../prisma/client";

export const getAuthors = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const authors = await prisma.author.findMany({
      include: {
        books: true,
      },
    });
    res.status(200).json({ data: authors });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch authors", details: error.message });
  }
};

export const getAuthorById = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const author = await prisma.author.findUnique({
      where: { id },
      include: { books: true },
    });

    if (!author) {
      res.status(404).json({ error: "Author not found" });
      return;
    }

    res.status(200).json({ data: author });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch author", details: error.message });
  }
};

export const createAuthor = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const authorData: Author = req.body;

    if (!authorData.name) {
      res.status(400).json({ error: "Author name is required" });
      return;
    }

    const author = await prisma.author.create({
      data: authorData,
    });
    res.status(201).json({ data: author });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create author", details: error.message });
  }
};

export const updateAuthorById = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const authorData = req.body;

    // Check if author exists
    const existingAuthor = await prisma.author.findUnique({
      where: { id },
    });

    if (!existingAuthor) {
      res.status(404).json({ error: "Author not found" });
      return;
    }

    const author = await prisma.author.update({
      where: { id },
      data: authorData,
    });
    res.status(200).json({ data: author });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update author", details: error.message });
  }
};

export const deleteAuthorById = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if author exists
    const existingAuthor = await prisma.author.findUnique({
      where: { id },
    });

    if (!existingAuthor) {
      res.status(404).json({ error: "Author not found" });
      return;
    }

    await prisma.$transaction([
      prisma.book.deleteMany({
        where: { authorId: id },
      }),
      prisma.author.delete({
        where: { id },
      }),
    ]);
    res.status(200).json({ message: "Author deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete author", details: error.message });
  }
};
