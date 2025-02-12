import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getAuthors } from "../../controllers/author.controller";

// Assuming your `authorClient` is a part of the PrismaClient.
jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      author: {
        findMany: jest.fn(),
      },
    })),
  };
});

describe("Author Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockFindMany: jest.Mock;

  beforeEach(() => {
    mockReq = {}; // You can add mock request parameters here if needed
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Retrieve the mock `findMany` method from the mock PrismaClient
    mockFindMany = new PrismaClient().author.findMany as jest.Mock;
  });

  it("should return all authors with their books", async () => {
    // Mock authors data
    const mockAuthors = [
      { id: "1", name: "Author 1", books: [] },
      { id: "2", name: "Author 2", books: [] },
    ];

    // Setup mock to return mock authors
    mockFindMany.mockResolvedValue(mockAuthors);

    // Call the controller method
    await getAuthors(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      data: mockAuthors,
    });
  });

  it("should handle errors appropriately", async () => {
    const error = new Error("Database error");

    // Mock to reject with an error
    mockFindMany.mockRejectedValue(error);

    // Call the controller method
    await getAuthors(mockReq as Request, mockRes as Response);

    // Assertions for error handling
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: error.message,
    });
  });
});
