const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.set_nutrition_history = async(req,res,next)=>{

    var history = JSON.stringify(req.body.history)
    var cid = req.body.client_id
    db.query(`SELECT * FROM nutrition_history WHERE client_id = ${cid}`,(err,results)=>{
        if(err) {errorHandler(err,req,res,next);return next();}
    if(results.length){
        db.query('UPDATE nutrition_history SET history = ? WHERE client_id = ?',[history,cid],(err)=>{
            if(err) {errorHandler(err,req,res,next);return next();}
            res.status(201).send({message: "nutrition history updated"})
        
        })
    }
    else { 
    db.query('INSERT INTO nutrition_history VALUES (?,?)',[cid,history],(err)=>{
        if(err) {errorHandler(err,req,res,next);return next();}
        res.status(201).send({message: "nutrition history inserted"})
    
    })
}
})


}