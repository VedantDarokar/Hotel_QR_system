const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

connectDB();

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for dev, restrict in prod
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Make io accessible in routes
app.set('socketio', io);

io.on('connection', (socket) => {
    // console.log('A user connected:', socket.id);

    socket.on('join_restaurant', (restaurantId) => {
        socket.join(restaurantId);
        // console.log(`User joined restaurant room: ${restaurantId}`);
    });

    socket.on('join_order', (orderId) => {
        socket.join(orderId);
    });

    socket.on('disconnect', () => {
        // console.log('User disconnected');
    });
});

app.use(cors());
app.use(express.json());


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/restaurants", require("./routes/restaurantRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/menu-items", require("./routes/menuRoutes"));
app.use("/api/tables", require("./routes/tableRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

app.use('/uploads', express.static('uploads'));




app.get("/", (req, res) => {
    res.send("Restaurant QR SaaS Backend Running 🚀");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

