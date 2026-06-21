import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";
import movieRoutes from "./modules/movies/movie.routes";
import seatRoutes from "./modules/seats/seat.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/movies", movieRoutes);
app.use("/api/showtimes", seatRoutes);

app.use(errorMiddleware);

export default app;
