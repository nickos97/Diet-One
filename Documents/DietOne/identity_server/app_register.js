const db = require('../services/connect_db')
var bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const {errorHandler} = require('../utils/errorHandler');
const {assign_client} = require('../utils/assign_client')
const {autoset_goals} = require('../utils/autoset_goals')

exports.app_register = async(req,res,next)=>{

    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var repass = req.body.rep_password;
    var fullName = req.body.fullName;
    var birth_date = req.body.birth_date;
    var gender = req.body.gender;
	var role = 'client' //static  

    if(repass==password) {
        db.query("select username from users where username=? OR email = ?",[username,email],function(err,results){
            if(results.length>0)
                res.status(409).send({message: "Το όνομα χρήστη χρησιμοποιείται ήδη"});
    
            else {
            var sql1="INSERT INTO users (username, pass,email, user_type) VALUES (?,?,?,?)";
            bcrypt.hash(password,10,(err, hash)=> {
                db.query(sql1,[username,hash,email,role],function(err, results){
                    if(err) {errorHandler(err,req,res,next);return next()};  
					console.log("1 record inserted");
                    db.query('SELECT user_id FROM users WHERE username = ?',[username],(err,id)=>{
                        if(err) {errorHandler(err,req,res,next);return next()};
                        var user_id = id[0].user_id
                        db.query('INSERT INTO clients (client_id,account_type,fullName,sex,birth_date,pregnant,breastfeeding) VALUES (?,?,?,?,?,?,?)',[user_id,'free',fullName,gender,birth_date,0,0],(err)=>{
                            if(err) {errorHandler(err,req,res,next);return next()};
                        const user_data = {user_id:user_id,username: username,user_type:role}
                        const token=jwt.sign(user_data,process.env.TOKEN_KEY)
                        user_data.email = email;
                        user_data.account_type='free';
                        assign_client(user_id);
                        autoset_goals(user_id);
                    res.header('auth-token',token).status(201).send(user_data)
                    })
                    })
                })
            });
            }
        })
        
    }
    else
        res.send({message:"This username already exists"});
}