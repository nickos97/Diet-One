const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');
const {get_current_date} = require('../../utils/get_current_date')

exports.get_client_event = async(req,res,next) => {
    var cid = req.user.user_id;
    var allEvents = {}
    var m = new Date();
    var cur_date = m.getUTCFullYear() +"-"+ (m.getUTCMonth()+1) +"-"+ m.getUTCDate() + " " + (m.getUTCHours()+2) + ":" + m.getUTCMinutes() + ":" + m.getUTCSeconds();
    console.log(cur_date)
    db.query(`SELECT * FROM client_events WHERE client_id = ${cid}`,(err,events)=>{
        if(err) {errorHandler(err,req,res,next); return next();}
        db.query(`SELECT link,date as meeting_date FROM meetings WHERE client_id = ${cid} AND date>= '${cur_date}'`,(err,meet)=>{
            if(err) {errorHandler(err,req,res,next); return next();}
            allEvents["events"] = events
            allEvents["meetings"] = meet
            res.status(200).send(allEvents);
            
        })
        

    })
}