const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.get_meetings = async(req,res,next)=>{

    var eid = req.user.user_id
    var cid = req.params.id 
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();


    today = yyyy + '-' + mm + '-' + dd;
    
    if(cid){
        db.query(`SELECT * FROM meetings WHERE employee_id = ${eid} AND client_id = ${cid}`,(err,meetings)=>{
            if(err) {errorHandler(err,req,res,next); return next();}
            res.status(200).send(meetings)
        })
    }
    else{
    db.query(`SELECT * FROM meetings WHERE employee_id = ${eid} AND DATE(date) = '${today}' `,(err,meetings)=>{
        if(err) {errorHandler(err,req,res,next); return next();}
        res.status(200).send(meetings)
    })
}

}