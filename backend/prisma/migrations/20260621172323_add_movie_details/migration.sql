-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "posterUrl" TEXT NOT NULL,
    "trailerUrl" TEXT NOT NULL DEFAULT '',
    "cast" TEXT NOT NULL DEFAULT '',
    "director" TEXT NOT NULL DEFAULT '',
    "writers" TEXT NOT NULL DEFAULT '',
    "averageRating" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "ratingBreakdown" TEXT NOT NULL DEFAULT '[]',
    "reviews" TEXT NOT NULL DEFAULT '[]',
    "releaseDate" DATETIME NOT NULL,
    "isNowShowing" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Movie" ("createdAt", "durationMinutes", "genre", "id", "isNowShowing", "language", "posterUrl", "rating", "releaseDate", "synopsis", "title", "updatedAt") SELECT "createdAt", "durationMinutes", "genre", "id", "isNowShowing", "language", "posterUrl", "rating", "releaseDate", "synopsis", "title", "updatedAt" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
CREATE UNIQUE INDEX "Movie_title_key" ON "Movie"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
