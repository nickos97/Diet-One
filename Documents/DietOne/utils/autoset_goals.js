const {errorHandler} = require('./errorHandler');
const db = require('../services/connect_db');
const {calculateAge} = require('./general')
const {classify_client} = require('./classify_client')
const {calculate_micro_goals} = require('./calculate_micro_goals')
exports.autoset_goals = async(cid,req,res,next) => {

    var macros = {
        protein: 100,
        fat: 100,
        carbs:100,
        calories: 2500
    }
    
    var macros = macros;
    var micros = calculate_micro_goals(macros['calories'],macros['fat']);
    var pregnant = 0;
    var bfeeding = 0;

    db.query(`SELECT birth_date,sex FROM clients WHERE client_id = ${cid}`,(err,dbinfo)=>{

        if(err) {errorHandler(err,req,res,next); return next();}
       

        var info = dbinfo[0]
        info['age'] = calculateAge(new Date(info['birth_date']))
        info['pregnant'] = pregnant;
        info['breastfeeding'] = bfeeding;
        var category = classify_client(info) 
        var insertion = [cid,category,macros['protein'],macros['fat'],macros['carbs'],macros['calories'],micros[0],micros[1],micros[2]];

        db.query(`INSERT INTO client_goals VALUES (?)`,[insertion],(err)=>{
            if(err) {errorHandler(err,req,res,next); return next();}
        })
        
    
   
})
}