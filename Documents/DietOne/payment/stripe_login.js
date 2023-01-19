const db = require('../services/connect_db')
var bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const {errorHandler} = require('../utils/errorHandler');

exports.stripe_login = async (req,res,next,login_info) => {
    return new Promise((resolve)=>{

    var email = login_info.email
    var cust_id = ""


    db.query(`SELECT * FROM users WHERE email = ?`,[email],(err,user)=>{
        console.log(user)
        if(err) {errorHandler(err,req,res,next);return next()};
        db.query(`SELECT * FROM clients WHERE client_id = ${user[0].user_id}`,(err,client)=>{
            if(err) {errorHandler(err,req,res,next);return next()};
                var client_info = {}
                //var client_info = {customer_id: cust_id, account_type: client[0].account_type}
                if(client[0]){ //no user err handling
                   
                    cust_id = client[0].customer_id || ""
                    client_info = {customer_id: cust_id, account_type: client[0].account_type}
                    resolve(client_info);
 
                }
                else
                    {res.send({message:"Τα στοιχεία σύνδεσης είναι λάθος"}); return next();}
                
                                    
         })
    })
})
}