const {errorHandler} = require('../utils/errorHandler');
const db = require('../services/connect_db');
const {diet_plan_app} = require('../utils/diet_plan_app')
exports.delete_meal = async(req,res,next)=>{
    var mid = req.params.id
    var cid = req.user.user_id
    db.query(`DELETE FROM diet_plan WHERE meal_id = ${mid} AND client_id = ${cid}`,async (err)=>{
        if(err) {errorHandler(err,req,res,next);return next()};
            var diet_plan = await diet_plan_app(cid,req,res,next);
            res.status(200).send(diet_plan)
       
    })
}