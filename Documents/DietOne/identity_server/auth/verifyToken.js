const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.VerifyAdmin = (req,res,next)=>{
   
    token=req.cookies.jwtToken || req.header('auth-token')
    console.log(token)
    //token = req.query.token
    if (typeof token!=='undefined') {
        jwt.verify(token,process.env.TOKEN_KEY,(err,user)=>{
            console.log(user)
            if(err || user.user_type!='admin') return res.status(403).send("Access denied")
            req.user=user
            next()
        })
        
    }
    
    else return res.status(401).send('token required for authentication')
}
exports.VerifyClient = (req,res,next)=>{
   
    token=req.cookies.jwtToken || req.header('auth-token')
    console.log(token)
    //token = req.query.token
    if (typeof token!=='undefined') {
        jwt.verify(token,process.env.TOKEN_KEY,(err,user)=>{
            console.log(user)
            if(err || user.user_type!='client') return res.status(403).send("Access denied")
            req.user=user
            next()
        })
        
    }
    
    else return res.status(401).send('token required for authentication')
}
exports.VerifyEmployee = (req,res,next)=>{
   
    token=req.cookies.jwtToken || req.header('auth-token')
    console.log(token)
    //token = req.query.token
    if (typeof token!=='undefined') {
        jwt.verify(token,process.env.TOKEN_KEY,(err,user)=>{
            console.log(user)
            if(err || user.user_type==='client') return res.status(403).send("Access denied")
            req.user=user
            next()
        })
        
    }
    
    else return res.status(401).send('token required for authentication')
}