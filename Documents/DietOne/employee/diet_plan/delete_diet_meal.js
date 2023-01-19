const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.delete_diet_meal = async(req,res,next)=>{
    var mid = req.params.id

    db.query(`DELETE FROM diet_plan WHERE meal_id = ${mid}`,(err)=>{
        if(err) {errorHandler(err,req,res,next);return next()};

            res.status(200).send({message: "diet meal deleted"})
       
    })
}