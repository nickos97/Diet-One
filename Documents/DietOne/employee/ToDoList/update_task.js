const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.update_task = async(req,res,next)=>{

    var info_update = req.body
    var tid = req.body.task_id

    db.query(`UPDATE todolist SET ? WHERE task_id = ${tid}`,info_update,(err)=>{
        if(err) {errorHandler(err,req,res,next);return next()}
        res.status(201).send({message: "Task updated"})
    })
}