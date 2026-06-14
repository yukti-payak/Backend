import mongoose from "mongoose";

const PositionsSchema = new mongoose.Schema({
     product: String,
    name: String,
    qty : Number,
    avg : Number,
    price: Number,
    net:  String,
    day: String,
    isLoss : Boolean,

});

const PositionsModel = mongoose.model("PositionsModel",  PositionsSchema);
export default PositionsModel;




