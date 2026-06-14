import express from 'express';
import passport from 'passport';


import { 
    getAllHoldings, 
    getAllPositions, 
    createNewOrder, 
    getAllOrders, 
    getDashboard 
} from '../controllers/portfolioController.js';

const router = express.Router();


router.get("/allHoldings", getAllHoldings);
router.get("/allPositions", getAllPositions);
router.post("/newOrders", createNewOrder);
router.get("/allOrders", getAllOrders);


router.get("/dashboard", passport.authenticate("jwt", { session: false }), getDashboard);

export default router;