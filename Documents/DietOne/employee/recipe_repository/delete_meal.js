const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.delete_meal = async(req,res,next) => {
    var mid = req.params.id

    db.query(`DELETE FROM meal_repo WHERE rmeal_id = ${mid}`,(err)=>{
        if(err) {errorHandler(err,req,res,next);return next()};

            res.status(200).send({message: "meal deleted"})
       
    })
}