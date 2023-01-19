const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.update_client_event = async(req,res,next) => {

    var event = req.body
    var cid = req.user.user_id;

    db.query(`UPDATE client_events SET ? WHERE client_id = ${cid} `,[event],(err)=>{
        if(err) {errorHandler(err,req,res,next); return next();}
        db.query(`SELECT * FROM client_events WHERE client_id = ${cid}`,(err,events)=>{
            if(err) {errorHandler(err,req,res,next); return next();}
        res.status(201).send(events);
        })
    })
}