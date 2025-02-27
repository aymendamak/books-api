import {
  createBook,
  deleteBookById,
  getBookById,
  getBooks,
  updateBookById,
} from "../../controllers/book.controller";
import { prismaMock } from "../../../prisma/singleton";
import { Request, Response } from "express";
import { mock } from "node:test";

describe("Books Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {} as unknown as Request;
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    jest.clearAllMocks();
  });

  describe("Book Controller", () => {
    it("getBooks should return all books with their authors", async () => {
      const mockBooks = [
        { id: "1", title: "Book 1", author: { id: "1", name: "Author 1" } },
        { id: "2", title: "Book 2", author: { id: "2", name: "Author 2" } },
      ];
      prismaMock.book.findMany.mockResolvedValueOnce(mockBooks as any);

      await getBooks(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockBooks });
    });

    it("getBooks should handle errors appropriately when findMany fails", async () => {
      const error = new Error("Database error");
      prismaMock.book.findMany.mockRejectedValueOnce(error);

      await getBooks(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to fetch books",
        details: error.message,
      });
    });

    it("GetBookById should return a single book with its author", async () => {
      const mockBook = {
        id: "1",
        title: "Book 1",
        author: { id: "1", name: "Author 1" },
      };
      mockReq.params = { id: "1" };

      prismaMock.book.findUnique.mockResolvedValueOnce(mockBook as any);

      await getBookById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockBook });
    });

    it("GetBookById should handle error properly", async () => {
      mockReq.params = { id: "1" };
      const error = new Error("Database error");
      prismaMock.book.findUnique.mockRejectedValueOnce(error);

      await getBookById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to fetch author",
        details: error.message,
      });
    });

    it("CreateBook should create a new book", async () => {
      const mockBook = {
        id: "1",
        title: "Book 1",
        description: "Description",
        author: { id: "1", name: "Author 1" },
      };
      mockReq.body = mockBook;
      prismaMock.book.create.mockResolvedValueOnce(mockBook as any);

      await createBook(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockBook });
    });

    it("CreateBook should handle error properly", async () => {
      const mockBook = {
        id: "1",
        title: "Book 1",
        description: "Description",
      };

      mockReq.body = mockBook;
      const error = new Error("Database error");
      prismaMock.book.create.mockRejectedValueOnce(error);

      await createBook(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });

    it("UpdateBookById should update a book", async () => {
      const mockBook = {
        id: "1",
        title: "Book 1",
        description: "Description",
      };

      mockReq.params = { id: "1" };
      mockReq.body = mockBook;

      prismaMock.book.findUnique.mockResolvedValueOnce(mockBook as any);
      prismaMock.book.update.mockResolvedValueOnce(mockBook as any);

      await updateBookById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockBook });
    });

    it("UpdateBookById should handle error properly", async () => {
      mockReq.params = {};
      await updateBookById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Id not found" });
    });

    it("UpdateBookById should handle error properly when book not found", async () => {
      mockReq.params = { id: "1" };
      prismaMock.book.findUnique.mockResolvedValueOnce(null);
      await updateBookById(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Book not found" });
    });

    it("DeleteBookById should delete a book", async () => {
      mockReq.params = { id: "1" };
      prismaMock.book.findUnique.mockResolvedValueOnce({ id: "1" } as any);
      prismaMock.book.delete.mockResolvedValueOnce({ id: "1" } as any);
      await deleteBookById(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it("DeleteBookById should handle error properly", async () => {
      mockReq.params = { id: "1" };
      const error = new Error("Database error");
      prismaMock.book.findUnique.mockRejectedValueOnce(error);
      await deleteBookById(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to delete book",
        details: error.message,
      });
    });

    it("DeleteBookById should handle error properly when no id given", async () => {
      mockReq.params = {};
      await deleteBookById(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Id not found" });
    });

    it("DeleteBookById should handle error properly when book not found", async () => {
      mockReq.params = { id: "1" };
      prismaMock.book.findUnique.mockResolvedValueOnce(null);
      await deleteBookById(mockReq as Request, mockRes as Response);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Book not found" });
    });
  });
});
