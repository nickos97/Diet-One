const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.create_meeting = async(req,res,next)=>{

    var eid = req.user.user_id
    var cid = req.body.client_id
    var date = req.body.date.split(".")[0]
    var link = req.body.link || ""
    var comments = req.body.comments || ""
    var type = req.body.type || "meeting"

    db.query(`SELECT * FROM meetings WHERE date = '${date}' AND type = '${type}'`,(err,meeting)=>{
        if(err) {errorHandler(err,req,res,next); return next();}
        if(meeting[0]) {
            res.status(409).send({message: "Meeting already exists"});
            return next();
        }
    db.query(`INSERT INTO meetings (employee_id,client_id,date,link,comments,type) VALUES (?,?,?,?,?,?)`,[eid,cid,date,link,comments,type],(err)=>{
        if(err) {errorHandler(err,req,res,next); return next();}
        res.status(200).send({message: "meeting created"})
    })
})

}