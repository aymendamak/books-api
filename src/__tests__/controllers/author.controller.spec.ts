import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getAuthors } from "../../controllers/author.controller";

jest.mock("@prisma/client", () => {
  const mockAuthors = [
    { id: "1", name: "Author 1", books: [] },
    { id: "2", name: "Author 2", books: [] },
  ];
  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        author: {
          findMany: jest.fn().mockResolvedValue(mockAuthors),
        },
      };
    }),
  };
});

describe("Student Controller", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let prisma: any;

  beforeEach(() => {
    mockReq = {} as unknown as Request;
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;

    prisma = new PrismaClient();

    jest.clearAllMocks();
  });

  it("should return all authors with their books", async () => {
    const mockAuthors = [
      { id: "1", name: "Author 1", books: [] },
      { id: "2", name: "Author 2", books: [] },
    ];
    prisma.author.findMany.mockResolvedValueOnce(mockAuthors);

    await getAuthors(mockReq as Request, mockRes as Response);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ data: mockAuthors });
  });
});
