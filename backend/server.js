import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import summaryRoutes from "./routes/summaryRoutes.js"

const app = express()
const PORT = 3000

dotenv.config()
// Middleware
app.use(cors())
app.use(express.json())

// Use summary routes
app.use("/api/summary", summaryRoutes)

app.get("/", (req, res) => {
    res.send("Hello, World!");
});


// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});
