require('dotenv').config(); 
const express = require("express");
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGODB_URL;
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require("passport");
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/auth'); 
const {HoldingsModel} = require('./model/HoldingsModel');
const {PositionsModel} = require ('./model/PositionsModel');
const{OrdersModel} = require ('./model/OrdersModel');
require("./config/passport")(passport);




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

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/auth', authRoutes);

// Your existing routes...
app.get("/allHoldings", async(req,res) => {
    try {
        let allHoldings = await HoldingsModel.find({});
        res.json(allHoldings);
    } catch (error) {
        console.error("Error fetching holdings:", error);
        res.status(500).json({ error: "Failed to fetch holdings" });
    }
});

app.get("/allPositions", async(req,res) => {
    try {
        let allPositions = await PositionsModel.find({});
        res.json(allPositions);
    } catch (error) {
        console.error("Error fetching positions:", error);
        res.status(500).json({ error: "Failed to fetch positions" });
    }
});

app.post("/newOrders", async(req,res) => {
    try {
        let newOrders = new OrdersModel({
            name: req.body.name,
            qty: req.body.qty,
            price: req.body.price,
            mode: req.body.mode, 
        });
        await newOrders.save();
        res.json({ message: "New order saved", order: newOrders });
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ error: "Failed to save order" });
    }
});

app.get("/allOrders", async(req, res) => {
    try {
        let allOrders = await OrdersModel.find({});
        res.json(allOrders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

app.get("/dashboard", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { password, ...safeUser } = req.user._doc;
    res.json({ message: "Welcome to dashboard", user: safeUser });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, async () => {
  try {
    if (!uri) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }
    await mongoose.connect(uri);
    console.log("DB connected successfully");
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Health check available at: http://localhost:${PORT}/health`);
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
});