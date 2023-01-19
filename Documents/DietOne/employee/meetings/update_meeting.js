const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.update_meeting = async(req,res,next)=>{

    var meet_id = req.body.meeting_id
    var meet_info = req.body
    db.query(`UPDATE meetings SET ? WHERE meeting_id = ${meet_id}`,meet_info,(err)=>{
        if(err) {errorHandler(err,req,res,next); return next();}
        res.status(201).send({message: "Meeting updated"})
    })

}