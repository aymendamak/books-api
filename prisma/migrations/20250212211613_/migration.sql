/*
  Warnings:

  - You are about to drop the column `description` on the `Author` table. All the data in the column will be lost.
  - Added the required column `biography` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Author" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "biography" TEXT NOT NULL
);
INSERT INTO "new_Author" ("id", "name") SELECT "id", "name" FROM "Author";
DROP TABLE "Author";
ALTER TABLE "new_Author" RENAME TO "Author";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
