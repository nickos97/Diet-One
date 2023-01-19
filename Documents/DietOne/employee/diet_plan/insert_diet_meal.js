const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.insert_diet_meal = async(req,res,next)=>{

    
    
    var consists = req.body.consists_of.toString()
    var quantities = req.body.quantities.toString()
    var comments = req.body.comments || ""
    if(consists.split(",").length != quantities.split(",").length || req.body.consists_of.includes(null) || req.body.quantities.includes(null) ) {
        res.status(400).send({message: "Bad request"});
        return next();
    }
    var data = [req.body.client_id,consists,quantities,req.body.meal_type,req.body.date,(new Array(req.body.quantities.length).fill(0)).toString(),"","",comments]

    db.query(`SELECT meal_id FROM diet_plan WHERE meal_type = '${req.body.meal_type}' AND date = '${req.body.date}' AND client_id = '${req.body.client_id}'`,(err,meal_id)=>{
        if(err) {errorHandler(err,req,res,next);return next()}
    if(meal_id.length) {
            db.query(`UPDATE diet_plan SET consists_of = '${consists}', quantities = '${quantities}', fullfilled = '${(new Array(req.body.quantities.length).fill(0)).toString()}', comments = '${comments}' WHERE meal_id = ${meal_id[0].meal_id}`,(err)=>{
                if(err) {errorHandler(err,req,res,next);return next()}
                res.send({message:"meal updated"})
            })
    }

    else{
    console.log(data)
    meal_types = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner']
    if (!meal_types.includes(req.body.meal_type)) {
        res.send("Invalid meal_type")
            return next()
    }

    db.query(`SELECT * FROM clients WHERE client_id = ${req.body.client_id}`,(err,results)=>{
        if(err) {errorHandler(err,req,res,next);return next()};

        if(!results.length) {
            res.send("Invalid client id")
            return next()
        }
    
    
            db.query(`INSERT INTO diet_plan (client_id,consists_of,quantities,meal_type,date,fullfilled,added,deleted,comments) VALUES (?,?,?,?,?,?,?,?,?)`,data,(err)=>{
                if(err) {errorHandler(err,req,res,next);return next()};
                res.send({message:"meal inserted"})
            })
        })
    }
    })




}