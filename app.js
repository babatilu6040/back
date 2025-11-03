import "dotenv/config";
import express from "express";
import Product from "./routes/Product.js";
import Auth from "./routes/Auth.js";
import cors from 'cors';
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("API is running...");
  
});
// Use routes
app.use("/api/users/product", Product);
app.use("/api/users/auth", Auth);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
