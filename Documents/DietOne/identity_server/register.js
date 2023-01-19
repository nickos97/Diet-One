const db = require('../services/connect_db')
var bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const {errorHandler} = require('../utils/errorHandler');
const stripe = require('stripe')(process.env.STRIPE_SK_KEY)
const {assign_client} = require('../utils/assign_client')
const {autoset_goals} = require('../utils/autoset_goals')

exports.employee_register = async (req,res,next) =>{
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var repass = req.body.rep_password;
	var role = req.body.role    
    
    var query;

    if(role=="admin")
        query=`INSERT INTO admin (admin_id) VALUES (?)`
    else if(role == "employee")
        query = `INSERT INTO employees (employee_id,client_count) VALUES (?,${0})`
    if(repass==password) {
        db.query("select username from users where username=?",[username],function(err,results){
            if(results.length>0)
                res.status(409).send("This username already exists");
    
            else {
            var sql1="INSERT INTO users (username, pass,email, user_type) VALUES (?,?,?,?)";
            bcrypt.hash(password,10,(err, hash)=> {
                db.query(sql1,[username,hash,email,role],function(err, results){
                    if(err) {errorHandler(err,req,res,next);return next()};  
					console.log("1 record inserted");
                    
                    db.query('SELECT user_id FROM users WHERE username = ?',[username],(err,id)=>{
                        if(err) {errorHandler(err,req,res,next);return next()};
                        var user_id = id[0].user_id

                        db.query(query,[user_id],(err)=>{
                            if(err) {errorHandler(err,req,res,next);return next()};
                        
                        const user_data = {user_id:user_id,username: username,user_type:role}
                        const token=jwt.sign(user_data,process.env.TOKEN_KEY)
                    
                        res.header('auth-token',token).status(201).send("user created")
                    })
                    })
                    })
            });
            }
        })
            
    }
    else
        res.send("Please insert the same password");
}

exports.client_register = async (req,res,next)=>{

    

    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var repass = req.body.rep_password;
	var role = 'client' //static    
    var birth_date = req.body.birth_date;
    var full_Name = req.body.fullName;
    var gender = req.body.gender
    var plan =  "free"
  
        db.query("select * from users where username=?",[username],function(err,results){
            if(err) {errorHandler(err,req,res,next);return next()};

            if(results.length>0) //update subscription
                res.status(409).send({message: "Username already exists"})
            
            else { // new registration/subscription
            var sql1="INSERT INTO users (username, pass,email, user_type) VALUES (?,?,?,?)";
            bcrypt.hash(password,10,(err, hash)=> {
                db.query(sql1,[username,hash,email,role],function(err, results){
                    if(err) {errorHandler(err,req,res,next);return next()};  
					console.log("1 record inserted");
                    db.query('SELECT user_id FROM users WHERE username = ?',[username],(err,id)=>{
                        if(err) {errorHandler(err,req,res,next);return next()};
                        var user_id = id[0].user_id
                        db.query('INSERT INTO clients (client_id,account_type,fullName,sex,birth_date,pregnant,breastfeeding) VALUES (?,?,?,?,?,?,?)',[user_id,plan,full_Name,gender,birth_date,0,0],(err)=>{
                            if(err) {
                                console.log("Error at client insertion, user deleted!!!")
                                db.query(`DELETE FROM users ORDER BY user_id DESC LIMIT 1;`,err=>{if(err) {console.log(err);return next()};})
                                errorHandler(err,req,res,next);
                                return next();
                            }
                        const user_data = {user_id:user_id,username: username,user_type:role}
                        // const token=jwt.sign(user_data,process.env.TOKEN_KEY)
                        // console.log(user_id)
                        assign_client(user_id);
                        autoset_goals(user_id);
                    res.status(201).send("user created")
                    
                    })
                    })
                })
            });
            }

        })
        
    


}
