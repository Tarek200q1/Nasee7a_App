import jwt from  "jsonwebtoken"

// Generate
export const generateToken = (payload , secret , option) => {
    return jwt.sign(payload , secret , option)
}

// Verify
export const verifyToken = (token , secret) => {
    return jwt.verify(token , secret)
}