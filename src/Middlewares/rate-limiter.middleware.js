import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import MongoStore from 'rate-limit-mongo';
import { getCountryCode } from "../Utils/index.js";

export const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max : async function(req){
    const {country_code} = await getCountryCode(req.headers['x-forwarded-for'])

    if(country_code == "EG") return 30
    return 15
  } ,
  requestPropertyName : 'rate_limit',
  statusCode : 429,
  legacyHeaders:false,
  message: 'To many requests from this IP , please try again after 15 minutes',
  keyGenerator: (req)=>{
    const ip = ipKeyGenerator(req.headers['x-forwarded-for']);
    return `${ip}-${req.path}`
  },
  store: new MongoStore({
    uri: process.env.DB_URL_LOCAL,
    collectionName : "rateLimiter",
    expireTimeMs: 5 * 60 * 1000,
  })
});
