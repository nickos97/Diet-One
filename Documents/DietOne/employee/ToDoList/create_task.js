const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.create_task = async(req,res,next)=>{

    var emp_id = req.user.user_id
    var task = req.body.task || ""
    var date = req.body.date

    db.query('INSERT INTO todolist (employee_id,task,date,completed) VALUES (?,?,?,?)',[emp_id,task,date,0],(err)=>{
        if(err) {errorHandler(err,req,res,next);return next()}
        res.status(201).send({message: "Task added"})
    })
}