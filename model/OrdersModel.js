import mongoose from "mongoose";

const  OrdersSchema = new mongoose.Schema({
     name: String,
    qty : Number,
    price: Number,
    mode: String,
});

const OrdersModel = mongoose.model(" OrdersModel", OrdersSchema );
export default OrdersModel;




