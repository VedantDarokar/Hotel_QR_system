import { io } from "socket.io-client";

// Singleton socket connection
const socket = io("http://localhost:5000");

export default socket;
