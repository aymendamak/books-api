import { Author, PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();

export const getAuthors = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const authors = await prisma.author.findMany({
      include: {
        books: true,
      },
    });
    res.status(200).json({ data: authors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAuthorById = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  const author = await prisma.author.findUnique({
    where: {
      id: id,
    },
    include: {
      books: true,
    },
  });
  res.json(author);
};

export const createAuthor = async (
  req: express.Request,
  res: express.Response
) => {
  const authorData: Author = req.body;
  const author = await prisma.author.create({
    data: authorData,
  });
  res.status(201).json({ data: author });
};

export const updateAuthorById = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  const authorData = req.body;

  const author = await prisma.author.update({
    where: {
      id: id,
    },
    data: authorData,
  });
  res.status(200).json({ data: author });
};

export const deleteAuthorById = async (
  req: express.Request,
  res: express.Response
) => {
  const { id } = req.params;
  await prisma.author.delete({
    where: {
      id: id,
    },
  });
  res.status(204).json();
};
