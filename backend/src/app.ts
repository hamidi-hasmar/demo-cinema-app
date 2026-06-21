import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";
import bookingRoutes from "./modules/bookings/booking.routes";
import concessionRoutes from "./modules/concessions/concession.routes";
import movieRoutes from "./modules/movies/movie.routes";
import seatRoutes from "./modules/seats/seat.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", seatRoutes);
app.use("/api/concessions", concessionRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(errorMiddleware);

export default app;
