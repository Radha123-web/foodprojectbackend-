const jwt =require('jsonwebtoken');
const dotenv =require('dotenv');
dotenv.config();

function verifyToken(req,res,next){
   const token =req.header('Authorization') ;
   let jwtSecretKey =process.env.JWT_SECRET_KEY;
   if(!token) return res.status(401).json({error:'Access denied'});
   try{
    const decoded =jwt.verify(token, jwtSecretKey);
    req.user =decoded.user;
    next();

   }
   catch(error){
    res.status(401).json({error:'Invalid token'});
   }
};
module.exports =verifyToken
