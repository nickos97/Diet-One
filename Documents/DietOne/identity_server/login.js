const db = require('../services/connect_db')
var bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const {errorHandler} = require('../utils/errorHandler');

exports.login = async(req,res,next)=>{
    
    var username=req.body.username || req.body.email;
    var email = req.body.email;
    var password=req.body.password;
    
    var sql = 'SELECT * FROM users WHERE email=? OR username=?'

    db.query(sql,[username,username],function(err,user){

        if(err) {errorHandler(err,req,res,next);return next()};
        
        if(user[0]){ //no user err handling
            bcrypt.compare(password,user[0].pass,(err,response)=>{
                if(response){
                    const user_data = {user_id:user[0].user_id,username: username,user_type:user[0].user_type}
                    const token=jwt.sign(user_data,process.env.TOKEN_KEY)
                    //refresh token
                    
                    if(user_data.user_type=='client'){
                        db.query(`SELECT account_type FROM clients WHERE client_id = ${user_data.user_id}`,(err,acc_type)=>{
                            if(err) {errorHandler(err,req,res,next);return next()};
                            delete user[0].pass
                            user[0].account_type = acc_type[0].account_type
                        res.header('auth-token',token).status(200).send(user[0])
                    })
                    }
                    else if (user_data.user_type=='employee'){
                        res.status(403).send({message:"Τα στοιχεία σύνδεσης είναι λάθος"})
                    }
                }
                else res.status(403).send({message:"Τα στοιχεία σύνδεσης είναι λάθος"})
            })
        }
        else res.status(404).send({message:"Ο χρήστης δε βρέθηκε"})
    })
}