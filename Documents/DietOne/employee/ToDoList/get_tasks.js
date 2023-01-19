const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.get_tasks = async(req,res,next)=>{
    var eid = req.user.user_id

    db.query(`SELECT * FROM todolist WHERE employee_id = ${eid}`,(err,tasks)=>{
        if(err) {errorHandler(err,req,res,next);return next()}
        res.status(200).send(tasks)
    })
}