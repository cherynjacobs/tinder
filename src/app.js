const express =require("express")
const app = express()

app.use("/",(req,res)=>{
    res.send("Hello guys")
})

app.listen(3000,()=>{
    console.log("Server started at port 3000")
})