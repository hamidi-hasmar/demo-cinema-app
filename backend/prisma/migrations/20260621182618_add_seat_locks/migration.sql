-- CreateTable
CREATE TABLE "SeatLock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "showtimeId" INTEGER NOT NULL,
    "seatNumber" TEXT NOT NULL,
    "lockedBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'LOCKED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SeatLock_showtimeId_fkey" FOREIGN KEY ("showtimeId") REFERENCES "Showtime" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SeatLock_showtimeId_seatNumber_key" ON "SeatLock"("showtimeId", "seatNumber");
