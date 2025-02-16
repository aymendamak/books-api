import { Request, Response } from "express";
import {
  getAuthors,
  getAuthorById,
  createAuthor,
  updateAuthorById,
  deleteAuthorById,
} from "../../controllers/author.controller";
import { prismaMock } from "../../../prisma/singleton";

describe("Author Controller", () => {
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

  describe("getAuthors", () => {
    it("getAuthors should return all authors with their books", async () => {
      const mockAuthors = [
        { id: "1", name: "Author 1", books: [] },
        { id: "2", name: "Author 2", books: [] },
      ];
      prismaMock.author.findMany.mockResolvedValueOnce(mockAuthors as any);

      await getAuthors(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockAuthors });
    });

    it("getAuthors should handle errors appropriately when findMany fails", async () => {
      const error = new Error("Database error");
      prismaMock.author.findMany.mockRejectedValueOnce(error);

      await getAuthors(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to fetch authors",
        details: error.message,
      });
    });
  });

  describe("getAuthorById", () => {
    it("getAuthorById should return a single author with their books", async () => {
      const mockAuthor = { id: "1", name: "Author 1", books: [] };
      mockReq.params = { id: "1" };
      prismaMock.author.findUnique.mockResolvedValueOnce(mockAuthor as any);

      await getAuthorById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockAuthor });
    });

    it("getAuthorById should handle errors appropriately when findUnique fails", async () => {
      mockReq.params = { id: "1" };
      const error = new Error("Database error");
      prismaMock.author.findUnique.mockRejectedValueOnce(error);

      await getAuthorById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to fetch author",
        details: error.message,
      });
    });

    it("getAuthorById should handle errors when no author id given", async () => {
      mockReq.params = {};
      await getAuthorById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Author not found",
      });
    });
  });

  describe("createAuthor", () => {
    it("createAuthor should create a new author", async () => {
      const mockAuthor = { id: "1", name: "Author 1", books: [] };
      mockReq.body = mockAuthor;
      prismaMock.author.create.mockResolvedValueOnce(mockAuthor as any);

      await createAuthor(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockAuthor });
    });
    it("createAuthor should handle errors when no author name given", async () => {
      mockReq.body = { name: "" };

      await createAuthor(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Author name is required",
      });
    });
  });

  describe("updateAuthorById", () => {
    it("updateAuthorById should update an author", async () => {
      const mockAuthor = { id: "1", name: "Author 1", books: [] };
      mockReq.params = { id: "1" };
      mockReq.body = mockAuthor;
      prismaMock.author.findUnique.mockResolvedValueOnce(mockAuthor as any);
      prismaMock.author.update.mockResolvedValueOnce(mockAuthor as any);

      await updateAuthorById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockAuthor });
    });

    it("updateAuthorById should handle errors when no author id given", async () => {
      await updateAuthorById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to update author",
        details:
          "Cannot destructure property 'id' of 'req.params' as it is undefined.",
      });
    });
  });

  describe("updateAuthorById", () => {
    it("deleteAuthorById should delete an author", async () => {
      const mockAuthor = { id: "1", name: "Author 1", books: [] };
      mockReq.params = { id: "1" };
      prismaMock.author.findUnique.mockResolvedValueOnce(mockAuthor as any);
      prismaMock.author.delete.mockResolvedValueOnce(mockAuthor as any);

      await deleteAuthorById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Author deleted successfully",
      });
    });

    it("deleteAuthorById should handle errors when no author id given", async () => {
      await deleteAuthorById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to delete author",
        details:
          "Cannot destructure property 'id' of 'req.params' as it is undefined.",
      });
    });

    it("deleteAuthorById should handle errors when author does not exist", async () => {
      mockReq.params = { id: "1" };
      prismaMock.author.findUnique.mockResolvedValueOnce(null);

      await deleteAuthorById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Author not found",
      });
    });
  });
});
