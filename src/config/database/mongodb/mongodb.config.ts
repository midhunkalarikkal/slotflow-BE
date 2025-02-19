import mongoose from 'mongoose';
import { mongoConfig } from '../../env';

const connectDB = async () => {
    try{
        await mongoose.connect(mongoConfig.mongoURL as string);
        console.log("MngoDB Connected...");
    }catch(error){
        console.error("MongoDB Connection Error : ",error);
        throw new Error("Databse connection failed");
    }
}

export default connectDB;