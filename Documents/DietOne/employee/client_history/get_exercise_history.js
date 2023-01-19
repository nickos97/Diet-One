const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.get_exercise_history = async(req,res,next)=>{

    
    var cid = req.params.id

    db.query(`SELECT history FROM exercise_history WHERE client_id = ${cid}`,(err,history)=>{
        if(err) {errorHandler(err,req,res,next);return next();}
        history = JSON.parse(history[0].history)
        res.send(history)


    })


}