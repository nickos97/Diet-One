const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.set_exercise_history = async(req,res,next)=>{

    var history = JSON.stringify(req.body.history)
    var cid = req.body.client_id
    db.query(`SELECT * FROM exercise_history WHERE client_id = ${cid}`,(err,results)=>{
        if(err) {errorHandler(err,req,res,next);return next();}
    if(results.length){
        db.query('UPDATE exercise_history SET history = ? WHERE client_id = ?',[history,cid],(err)=>{
            if(err) {errorHandler(err,req,res,next);return next();}
            res.status(201).send({message: "exercise history updated"})
        
        })
    }
    else { 
    db.query('INSERT INTO exercise_history VALUES (?,?)',[cid,history],(err)=>{
        if(err) {errorHandler(err,req,res,next);return next();}
        res.status(201).send({message: "exercise history inserted"})
    
    })
}
})


}