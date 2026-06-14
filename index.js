import 'dotenv/config';
import express from "express";
import cors from 'cors';
import passport from "passport";
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import connectDB from "./config/db.js";
import configurePassport from "./config/passport.js";

const app = express();
const PORT = process.env.PORT || 3002;

configurePassport(passport);

app.use(cors({
  origin: [
    "https://dashboard-two-murex-20.vercel.app",    
    "https://frontend-zeta-eight-43.vercel.app",    
    "http://localhost:3000",
    "http://localhost:5173", 
    process.env.FRONTEND_URL,
  ].filter(Boolean), 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));


app.options('*', cors());

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({extended: false, limit: '10mb'}));
app.use(passport.initialize());


app.use('/', portfolioRoutes);
app.use('/api/auth', authRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});



app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running successfully on port ${PORT}`);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
});