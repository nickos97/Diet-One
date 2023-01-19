const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');
const {calculateAge} = require('../../utils/general');

exports.client_by_id = async(req,res,next) =>{
    var cid = req.params.id

    db.query('SELECT * FROM clients WHERE client_id = ?',[cid],(err,results)=>{
        if (err) {errorHandler(err,req,res,next);return next()};
        if(!results.length){
            res.send({message: "There is no such client"})
            return next()
        }
        console.log(results)
        var age = 0
        db.query(`SELECT email FROM users WHERE user_id = ${cid}`,(err,emails)=>{
            if(err) {errorHandler(err,req,res,next);return next()};
            
        for (var i=0; i<results.length; i++){
            if(results[i].birth_date) {
                age=calculateAge(results[i].birth_date)
                results[i].age = age
                results[i].email = emails[i].email
            }
        }
        
        res.send(results)
    })
    })
}