import dotenv from "dotenv";
import { createServer } from "http";
import app from "./app";
import { registerSeatWebSocketServer } from "./modules/seats/seat.websocket";

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = createServer(app);

registerSeatWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
