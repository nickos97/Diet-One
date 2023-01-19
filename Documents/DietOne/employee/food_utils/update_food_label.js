const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.update_food_label = async(req,res,next)=>{

    var code = req.body.code
    var label = req.body.label

    db.query(`UPDATE nutrition_info SET label = '${label}' WHERE code = ${code}`,(err)=>{
        if(err) {errorHandler(err,req,res,next); return next();}

        res.status(201).send({message: "label updated"})
    })

}