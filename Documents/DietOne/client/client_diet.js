require('dotenv').config()
const { diet_plan_app } = require('../utils/diet_plan_app');

exports.client_diet = async(req,res,next) =>{

    var cid = req.user.user_id
    var diet_plan = await diet_plan_app(cid,req,res,next);
    
    res.send(diet_plan)
    
} 