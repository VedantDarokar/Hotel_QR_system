import { io } from "socket.io-client";

// Singleton socket connection
const socket = io("https://hotel-qr-system.onrender.com");

export default socket;
