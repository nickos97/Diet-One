const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.delete_client_event = async(req,res,next) => {
    var cid = req.user.user_id;
    var event_id = req.params.id
    
    db.query(`DELETE FROM client_events WHERE event_id = ${event_id}`,(err)=>{
        if(err) {errorHandler(err,req,res,next); return next();}
        db.query(`SELECT * FROM client_events WHERE client_id = ${cid}`,(err,events)=>{
            if(err) {errorHandler(err,req,res,next); return next();}
        res.status(200).send(events);
        })

    })
}