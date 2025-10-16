import 'dotenv/config'
import express from "express";
import cors from 'cors'
import helmet from 'helmet';

import * as Controller from "./Modules/controller.index.js"

import dbConnection from "./DB/db.connection.js";

import { limiter } from './Middlewares/index.js';

import "./cron-jobs/tokenCleanup.job.js"

const app = express();


//Barsing Middleware
app.use(express.json());
app.use('/uploads' , express.static('/uploads'))


const whitelist = process.env.WHITE_LISTED_ORIGINS ;
const corsOption = {
    origin: function(origin , callback) {
      
      if(!origin || whitelist.includes(origin)){
        callback(null , true)
      }else{
        callback(new Error('Not allowed by CORS'))
      }
    }
}

// use some security middlewares
app.use(cors(corsOption) , helmet());


app.use(limiter)

//Handle routes
app.use("/api/users", Controller.userRouter , Controller.authRouter);
app.use("/api/messages", Controller.messageRouter);


//Database connection
dbConnection();


//Error handling middleware
app.use(async(err , req , res , next) => {
    console.error(err.stack);
    if(req.session && req.session.inTransaction()){
        // abort transaction
        await req.session.abortTransaction();
        // end session
        session.endSession();
            console.log("The transaction is aborted", err);
    }
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