const {errorHandler} = require('../utils/errorHandler');
const db = require('../services/connect_db');
const {calculateAge} = require('../utils/general')

exports.getAllClients = async(req,res,next) => {

    db.query(`SELECT * FROM clients`,(err,results) =>{
        if(err) {errorHandler(err,req,res,next); return next();}
        results.forEach(client=> client["age"] = calculateAge(client["birth_date"]))
        res.send(results)
    })

}