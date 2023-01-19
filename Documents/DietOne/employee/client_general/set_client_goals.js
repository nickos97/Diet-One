const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');
const {calculateAge} = require('../../utils/general')
const {classify_client} = require('../../utils/classify_client')
const {calculate_micro_goals} = require('../../utils/calculate_micro_goals')

exports.set_client_goals = async(req,res,next) => {

    var cid = parseInt(req.body.client_id) || 0;
    var macros = req.body.macros;
    var micros = calculate_micro_goals(macros['calories'],macros['fat']);
    var pregnant = req.body.pregnant || 0;
    var bfeeding = req.body.breastfeeding || 0;

    db.query(`SELECT birth_date,sex FROM clients WHERE client_id = ${cid}`,(err,dbinfo)=>{
        if(err) {errorHandler(err,req,res,next); return next();}
        if(!dbinfo.length) {res.status(400).send({message: "Invalid client id"}); return next();}

        if(dbinfo[0]["birth_date"]==null || dbinfo[0]['sex'] == null) {
            res.status(424).send({message: "Not enough info for client"}); return next();
        }

        var info = dbinfo[0]
        info['age'] = calculateAge(new Date(info['birth_date']))
        info['pregnant'] = pregnant;
        info['breastfeeding'] = bfeeding;
        var category = classify_client(info) 
        var insertion = [cid,category,macros['protein'],macros['fat'],macros['carbs'],macros['calories'],micros[0],micros[1],micros[2]];

    db.query(`SELECT * FROM client_goals WHERE client_id = ${cid}`,(err,results)=>{
        if(err) {errorHandler(err,req,res,next); return next();}
        if(!results.length){
            db.query(`INSERT INTO client_goals VALUES (?)`,[insertion],(err)=>{
                if(err) {errorHandler(err,req,res,next); return next();}
                res.status(200).send({message: "Goals inserted!!!"})
        
            })
        }
        else {
            db.query(`UPDATE client_goals SET category='${category || 0}', protein=${macros['protein'] || 0}, fat=${macros['fat'] || 0},carbs= ${macros['carbs'] || 0},calories=${macros['calories'] || 0},saturated = ${micros[0] || 0},monounsaturated = ${micros[1] || 0},polyunsaturated = ${micros[2] || 0} WHERE client_id = ${cid}`,err=>{
                if (err) {errorHandler(err,req,res,next); return next();}
                res.status(200).send({message: "Goals updated!!!"})
            })
        }
    })
})

}