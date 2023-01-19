const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.delete_task = async(req,res,next)=>{
    var tid = req.params.id

    db.query(`DELETE FROM todolist WHERE task_id = ${tid}`,(err)=>{
        if(err) {errorHandler(err,req,res,next);return next()}
        res.status(200).send({message: "Task deleted"})
    })
}