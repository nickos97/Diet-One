const db = require('../services/connect_db')
const {errorHandler} = require('../utils/errorHandler');

exports.get_account = async(req,res,next) =>{

    var cid = req.user.user_id;

    db.query(`SELECT users.user_id,users.username,users.email,clients.account_type FROM users INNER JOIN clients ON clients.client_id = users.user_id WHERE users.user_id = ${cid}`,(err,user)=>{
        if(err) {errorHandler(err,req,res,next); return next();}
        res.send(user)
    })
}