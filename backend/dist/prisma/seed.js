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
        trailerUrl: "https://example.com/trailers/the-last-voyage",
        cast: "Maya Chen, Idris Vale, Nora Beck, Theo Hart",
        director: "Lina Mercer",
        writers: "Samir Patel, Lina Mercer",
        averageRating: 4.2,
        reviewCount: 28,
        ratingBreakdown: JSON.stringify([12, 8, 5, 2, 1]),
        reviews: JSON.stringify([
            {
                author: "Aina",
                rating: 5,
                title: "INTERESTING MOVIE!",
                comment: "Tense, polished, and surprisingly emotional.",
            },
            {
                author: "Daniel",
                rating: 4,
                title: "Great cinema night",
                comment: "The sound design made the space scenes feel huge.",
            },
        ]),
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
        trailerUrl: "https://example.com/trailers/midnight-kopitiam",
        cast: "Raymond Tan, Siti Amira, Low Wei Jun, Priya Raman",
        director: "Farah Nordin",
        writers: "Farah Nordin, Caleb Ong",
        averageRating: 4.6,
        reviewCount: 41,
        ratingBreakdown: JSON.stringify([23, 12, 4, 2, 0]),
        reviews: JSON.stringify([
            {
                author: "Mei",
                rating: 5,
                title: "Warm and mysterious",
                comment: "A beautiful local story with a strong final act.",
            },
            {
                author: "Haziq",
                rating: 4,
                title: "Worth watching",
                comment: "Quiet at first, then it really pulls you in.",
            },
        ]),
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
        trailerUrl: "https://example.com/trailers/operation-monsoon",
        cast: "Adam Reyes, Nadia Lim, Marcus Steele, Hana Yusof",
        director: "Victor Lau",
        writers: "Victor Lau, Erin Cole",
        averageRating: 4.0,
        reviewCount: 20,
        ratingBreakdown: JSON.stringify([8, 6, 4, 2, 0]),
        reviews: JSON.stringify([
            {
                author: "Ravi",
                rating: 4,
                title: "Solid action",
                comment: "Fast pacing and a clean action setup.",
            },
            {
                author: "Nora",
                rating: 3,
                title: "Good but familiar",
                comment: "The set pieces are strong, the story is straightforward.",
            },
        ]),
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
        trailerUrl: "https://example.com/trailers/little-lanterns",
        cast: "Grace Wong, Lim Kai, Sarah Abdullah, Ben Chua",
        director: "Elaine Ho",
        writers: "Elaine Ho",
        averageRating: 4.8,
        reviewCount: 36,
        ratingBreakdown: JSON.stringify([29, 5, 2, 0, 0]),
        reviews: JSON.stringify([
            {
                author: "Sofia",
                rating: 5,
                title: "Lovely family film",
                comment: "Sweet, funny, and perfect for a weekend show.",
            },
            {
                author: "Jun",
                rating: 5,
                title: "Beautiful message",
                comment: "The festival scenes are charming.",
            },
        ]),
        releaseDate: new Date("2026-04-30"),
        isNowShowing: true,
    },
];
const movieShowtimes = {
    "The Last Voyage": [
        {
            location: "Kuala Lumpur",
            cinemaHall: "Hall 1 - Pavilion KL",
            showDate: new Date("2026-06-22"),
            startTime: "9:20AM",
            ticketType: "Standard",
            minPrice: 2000,
            maxPrice: 5000,
        },
        {
            location: "Kuala Lumpur",
            cinemaHall: "Hall 1 - Pavilion KL",
            showDate: new Date("2026-06-22"),
            startTime: "1:20PM",
            ticketType: "Standard",
            minPrice: 2000,
            maxPrice: 5000,
        },
        {
            location: "Kuala Lumpur",
            cinemaHall: "Hall 2 - TRX",
            showDate: new Date("2026-06-23"),
            startTime: "7:30PM",
            ticketType: "Premium",
            minPrice: 3000,
            maxPrice: 6500,
        },
        {
            location: "Petaling Jaya",
            cinemaHall: "Hall 4 - 1 Utama",
            showDate: new Date("2026-06-24"),
            startTime: "5:40PM",
            ticketType: "Standard",
            minPrice: 2000,
            maxPrice: 5000,
        },
    ],
    "Midnight Kopitiam": [
        {
            location: "Petaling Jaya",
            cinemaHall: "Hall 3 - The Curve",
            showDate: new Date("2026-06-22"),
            startTime: "11:40AM",
            ticketType: "Standard",
            minPrice: 1800,
            maxPrice: 4500,
        },
        {
            location: "Petaling Jaya",
            cinemaHall: "Hall 3 - The Curve",
            showDate: new Date("2026-06-23"),
            startTime: "3:30PM",
            ticketType: "Standard",
            minPrice: 1800,
            maxPrice: 4500,
        },
        {
            location: "Shah Alam",
            cinemaHall: "Hall 5 - Setia City Mall",
            showDate: new Date("2026-06-24"),
            startTime: "9:20PM",
            ticketType: "Premium",
            minPrice: 2500,
            maxPrice: 5500,
        },
    ],
    "Operation Monsoon": [
        {
            location: "Kuala Lumpur",
            cinemaHall: "Hall 6 - Mid Valley",
            showDate: new Date("2026-06-22"),
            startTime: "1:20PM",
            ticketType: "Standard",
            minPrice: 2200,
            maxPrice: 5200,
        },
        {
            location: "Kuala Lumpur",
            cinemaHall: "Hall 6 - Mid Valley",
            showDate: new Date("2026-06-22"),
            startTime: "7:30PM",
            ticketType: "Standard",
            minPrice: 2200,
            maxPrice: 5200,
        },
        {
            location: "Subang Jaya",
            cinemaHall: "Hall 2 - Sunway Pyramid",
            showDate: new Date("2026-06-25"),
            startTime: "9:20PM",
            ticketType: "Premium",
            minPrice: 3200,
            maxPrice: 6800,
        },
    ],
    "Little Lanterns": [
        {
            location: "Kuala Lumpur",
            cinemaHall: "Hall 7 - Suria KLCC",
            showDate: new Date("2026-06-22"),
            startTime: "9:20AM",
            ticketType: "Family",
            minPrice: 1500,
            maxPrice: 4200,
        },
        {
            location: "Kuala Lumpur",
            cinemaHall: "Hall 7 - Suria KLCC",
            showDate: new Date("2026-06-23"),
            startTime: "11:40AM",
            ticketType: "Family",
            minPrice: 1500,
            maxPrice: 4200,
        },
        {
            location: "Petaling Jaya",
            cinemaHall: "Hall 1 - Paradigm Mall",
            showDate: new Date("2026-06-24"),
            startTime: "5:40PM",
            ticketType: "Standard",
            minPrice: 1800,
            maxPrice: 4500,
        },
    ],
};
async function main() {
    for (const movie of movies) {
        const savedMovie = await prisma.movie.upsert({
            where: {
                title: movie.title,
            },
            update: movie,
            create: movie,
        });
        await prisma.showtime.deleteMany({
            where: {
                movieId: savedMovie.id,
            },
        });
        await prisma.showtime.createMany({
            data: movieShowtimes[movie.title].map((showtime) => ({
                ...showtime,
                movieId: savedMovie.id,
            })),
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
