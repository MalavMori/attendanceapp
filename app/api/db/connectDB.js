
import mongoose from "mongoose";

const DB = await mongoose.connect(process.env.DATABASE_URL);

export default DB
