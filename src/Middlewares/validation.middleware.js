

const reqKeys = ['body' , 'params' , 'query' , 'headers'];

export const validationMiddleware = (schema)=>{
    return (req , res , next)=>{

        const validationError = []

        for (const key of reqKeys) {
            if(schema[key]){
                const {error} = schema[key].validate(req[key] , {abortEarly:false})
                if(error){
                    validationError.push(...error.details)
                }
            }
        }
        if(validationError.length){
            return res.status(400).json({message : "validation failed" , errors:validationError})
        }
        next()
    }
}