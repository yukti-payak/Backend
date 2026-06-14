import mongoose from "mongoose";
const  connectDB = async() =>{
    const uri = process.env.MONGODB_URL;
    try{
        await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
    } catch(error){
        console.log(error.message);
    }
}
export default connectDB;