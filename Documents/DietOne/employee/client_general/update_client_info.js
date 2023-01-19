const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.update_client_info = async(req,res,next)=>{
    var info = req.body
    var cid = info.client_id
    delete info.cliend_id
    console.log(info)
    //check if the employee has the specific client
    var query = `UPDATE clients SET ? WHERE client_id = ${cid}`
    db.query(query,info,(err)=>{
        if(err) {errorHandler(err,req,res,next);return next()};
        res.status(201).json({message: "client info updated successfully"})
    })
}