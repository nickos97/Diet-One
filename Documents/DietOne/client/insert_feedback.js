const db = require('../services/connect_db')
const {errorHandler} = require('../utils/errorHandler');
const { diet_plan_app } = require('../utils/diet_plan_app');

exports.insert_feedback = async(req,res,next) =>{
    var cid = req.user.user_id
    var fullfilled = req.body.fullfilled
    var date = req.body.date.split("T")[0]
    var meal_type = req.body.meal_type

    db.query(`UPDATE diet_plan SET fullfilled = '${fullfilled}' WHERE date = '${date}' AND meal_type = '${meal_type}'`,async (err)=>{
        if(err) {errorHandler(err,req,res,next);return next();}
        var diet_plan = await diet_plan_app(cid,req,res,next);
    
        res.send(diet_plan)
    })
}