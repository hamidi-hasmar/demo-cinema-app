"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("../generated/prisma/client");
const adapter_better_sqlite3_1 = require("@prisma/adapter-better-sqlite3");
const adapter = new adapter_better_sqlite3_1.PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new client_1.PrismaClient({ adapter });
const movies = [
    {
        title: "The Last Voyage",
        synopsis: "A rescue crew races against time after a deep-space signal leads them to a stranded passenger ship.",
        durationMinutes: 128,
        language: "English",
        genre: "Sci-Fi",
        rating: "PG-13",
        posterUrl: "https://placehold.co/300x450?text=The+Last+Voyage",
        releaseDate: new Date("2026-06-01"),
        isNowShowing: true,
    },
    {
        title: "Midnight Kopitiam",
        synopsis: "Three strangers meet at an old coffee shop and uncover a secret that changes the city overnight.",
        durationMinutes: 104,
        language: "Malay",
        genre: "Drama",
        rating: "P13",
        posterUrl: "https://placehold.co/300x450?text=Midnight+Kopitiam",
        releaseDate: new Date("2026-05-23"),
        isNowShowing: true,
    },
    {
        title: "Operation Monsoon",
        synopsis: "An elite unit must protect a key witness during a citywide storm and a coordinated attack.",
        durationMinutes: 116,
        language: "English",
        genre: "Action",
        rating: "18",
        posterUrl: "https://placehold.co/300x450?text=Operation+Monsoon",
        releaseDate: new Date("2026-06-13"),
        isNowShowing: true,
    },
    {
        title: "Little Lanterns",
        synopsis: "A family rediscovers hope when their annual festival plans are interrupted by an unexpected visitor.",
        durationMinutes: 92,
        language: "Mandarin",
        genre: "Family",
        rating: "U",
        posterUrl: "https://placehold.co/300x450?text=Little+Lanterns",
        releaseDate: new Date("2026-04-30"),
        isNowShowing: true,
    },
];
async function main() {
    for (const movie of movies) {
        await prisma.movie.upsert({
            where: {
                title: movie.title,
            },
            update: movie,
            create: movie,
        });
    }
}
main()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
