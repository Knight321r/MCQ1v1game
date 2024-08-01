import mongoose from "mongoose";

export default async function connect(){
    mongoose.connect("mongodb+srv://rohitnalapur:8fbBoifCINVYtVzt@quiz.qvisoto.mongodb.net/?retryWrites=true&w=majority&appName=Quiz")
    console.log("Database connected")  
}