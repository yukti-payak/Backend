import OrdersModel from "../model/OrdersModel.js";
import  PositionsModel from "../model/PositionsModel.js";
import HoldingsModel from "../model/HoldingsModel.js";

// GET /allHoldings
export const getAllHoldings = async (req, res) => {
    try {
        let allHoldings = await HoldingsModel.find({});
        res.json(allHoldings);
    } catch (error) {
        console.error("Error fetching holdings:", error);
        res.status(500).json({ error: "Failed to fetch holdings" });
    }
};

// GET /allPositions
export const getAllPositions = async (req, res) => {
    try {
        let allPositions = await PositionsModel.find({});
        res.json(allPositions);
    } catch (error) {
        console.error("Error fetching positions:", error);
        res.status(500).json({ error: "Failed to fetch positions" });
    }
};

// POST /newOrders
export const createNewOrder = async (req, res) => {
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
};

// GET /allOrders
export const getAllOrders = async (req, res) => {
    try {
        let allOrders = await OrdersModel.find({});
        res.json(allOrders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

// GET /dashboard
export const getDashboard = (req, res) => {
    const { password, ...safeUser } = req.user._doc;
    res.json({ message: "Welcome to dashboard", user: safeUser });
};