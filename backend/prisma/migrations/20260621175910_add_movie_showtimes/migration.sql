-- CreateTable
CREATE TABLE "Showtime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "movieId" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "cinemaHall" TEXT NOT NULL,
    "showDate" DATETIME NOT NULL,
    "startTime" TEXT NOT NULL,
    "ticketType" TEXT NOT NULL,
    "minPrice" INTEGER NOT NULL,
    "maxPrice" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Showtime_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Showtime_movieId_location_cinemaHall_showDate_startTime_key" ON "Showtime"("movieId", "location", "cinemaHall", "showDate", "startTime");
