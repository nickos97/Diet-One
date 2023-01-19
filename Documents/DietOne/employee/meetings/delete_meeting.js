const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.delete_meeting = async(req,res,next)=>{

    var meet_id = req.params.id
   
    db.query(`DELETE FROM meetings WHERE meeting_id = ${meet_id}`,(err)=>{
        if(err) {errorHandler(err,req,res,next); return next();}
        res.status(200).send({message: "Meeting deleted"})
    })

}