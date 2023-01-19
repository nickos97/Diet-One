const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.create_meal = async(req,res,next) => { //change structure
    //var emid = req.user.user_id
    //return next(new Error("Endpoint to be changed"))
    var consists = req.body.consists_of.toString()
    var quantities = req.body.quantities.toString()
    var data = [req.body.name,consists,quantities,req.body.meal_type]

        db.query(`INSERT INTO meal_repo (name,codes,quantities) VALUES (?,?,?)`,data,err=>{
            if(err) {errorHandler(err,req,res,next);return next()}//{errorHandler(err,req,res,next);return next()};
            res.send("added to repo")
        })
}