const mongoose = require("mongoose")

const connectDB = async()=>{
    try {
        await mongoose.connect("mongodb+srv://yogesh:yogeshkc@cluster0.4bvj97s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("Database connection established...")
    } catch (error) {
    console.log(error.messages)    
    process.exit(1)
    }

}

module.exports = connectDB