const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.set_client_event = async(req,res,next) => {

    var event = req.body.event;
    var date = req.body.date;
    var cid = req.user.user_id;
    
    db.query('INSERT INTO client_events (client_id, event, date) VALUES (?,?,?)',[cid,event,date],(err)=>{
        if(err) {errorHandler(err,req,res,next); return next();}
        db.query(`SELECT * FROM client_events WHERE client_id = ${cid}`,(err,events)=>{
            if(err) {errorHandler(err,req,res,next); return next();}
        res.status(201).send(events);
        })
    })
}