const db = require('../services/connect_db')
const {errorHandler} = require('../utils/errorHandler');

exports.get_foods = async(req,res,next) =>{

    db.query('SELECT code,name FROM nutrition_info',(err,food_info)=>{
        if(err) {errorHandler(err,req,res,next);return next()};
        res.send(food_info)
    })
}