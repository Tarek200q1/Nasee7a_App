import 'dotenv/config'
import express from "express";
import userRouter from "./Modules/Users/user.controller.js"
import messageRouter from "./Modules/Messages/message.controller.js"
import dbConnection from "./DB/db.connection.js";
const app = express();


//Barsing Middleware
app.use(express.json());

//Handle routes
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);


//Database connection
dbConnection();


//Error handling middleware
app.use((err , req , res , next) => {
    console.error(err.stack);
    res.status(err.cause || 500).json({message : "something broke!" , err:err.message , stack: err.stack})
});



//Not found middleware
app.use((req , res)=>{
    res.status(404).send("Not Found")
});


//Running Server
app.listen(process.env.PORT , ()=>{
    console.log(`Server is running on port ` + process.env.PORT );
})