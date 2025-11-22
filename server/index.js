// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const statsRoutes = require('./routes/stats');
const scrapeRoutes = require('./routes/scrapeRoutes');
// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
// Middleware
app.use(cors({
  origin: "*", // allow extension + your frontend
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// --- API Routes ---
// When a request comes to '/api/auth', use the 'authRoutes' file
app.use('/api/auth', authRoutes);
// When a request comes to '/api/jobs', use the 'jobRoutes' file
app.use('/api/jobs', jobRoutes);
// When a request comes to '/api/stats', use the 'statsRoutes' file
app.use('/api/stats', statsRoutes);
app.use('/api/scrape', scrapeRoutes);
// Simple health check
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});