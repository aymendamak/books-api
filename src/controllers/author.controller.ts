import { Author, PrismaClient } from "@prisma/client";
import express from "express";

const authorClient = new PrismaClient().author;

export const getAuthors = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const authors = await authorClient.findMany({
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
  const author = await authorClient.findUnique({
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
  const author = await authorClient.create({
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

  const author = await authorClient.update({
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
  await authorClient.delete({
    where: {
      id: id,
    },
  });
  res.status(204).json();
};
