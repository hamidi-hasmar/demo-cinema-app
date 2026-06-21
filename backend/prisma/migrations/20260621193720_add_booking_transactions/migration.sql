-- CreateTable
CREATE TABLE "BookingTransaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reference" TEXT NOT NULL,
    "showtimeId" INTEGER NOT NULL,
    "ticketType" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "cinemaHall" TEXT NOT NULL,
    "showDate" DATETIME NOT NULL,
    "startTime" TEXT NOT NULL,
    "seats" TEXT NOT NULL,
    "concessions" TEXT NOT NULL DEFAULT '[]',
    "ticketTotal" INTEGER NOT NULL,
    "concessionTotal" INTEGER NOT NULL,
    "grandTotal" INTEGER NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "cardLastFour" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'PAID',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BookingTransaction_showtimeId_fkey" FOREIGN KEY ("showtimeId") REFERENCES "Showtime" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BookingTransaction_reference_key" ON "BookingTransaction"("reference");
