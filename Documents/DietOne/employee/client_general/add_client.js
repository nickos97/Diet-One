const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.add_client = async(req,res,next)=>{
    var email = req.body.email
    var empid = req.user.user_id
    console.log(`employee id: ${empid}, client email: ${email}`)
    console.log(empid)
    db.query("SELECT * FROM users WHERE email=?",[email],(err,results)=>{
        if(err) {errorHandler(err,req,res,next);return next()};
        if(results) {
            uid = results[0].user_id

            db.query("INSERT INTO has_client (employee_id,client_id)  SELECT ?,? WHERE NOT EXISTS (SELECT 1 FROM has_client WHERE employee_id = ? AND client_id = ?)",[empid,uid,empid,uid],(err)=>{
                if(err) {errorHandler(err,req,res,next);return next()};
                res.status(201).json({message:"client added successfully!!!"})
            })
        }
        else {
            res.send("There is no such user")
        }

    })
}