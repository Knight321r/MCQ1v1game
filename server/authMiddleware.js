import User from "./Models/usermodel.js";
import jwt from 'jsonwebtoken';
export const protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            
            token = req.headers.authorization.split(' ')[1];
            // console.log("token:", token)
            const decoded = jwt.verify(token, "secret");
            // console.log("decoded:", decoded)
            req.user = await User.findById(decoded.userId).select('-password')
            // console.log('user here :', req.user)
            
            next();
        }
        catch(error){
            console.log("nen ikkada unna")
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if(!token){
        res.status(401).json({message : 'Not authorized, no token'})  
    }
}