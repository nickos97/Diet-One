const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');
const {meal_object,calculate_macros,calculate_micros,float2} =require('../../utils/general')
var groupBy = require('lodash.groupby');
const {diet_plan} = require('../../utils/diet_plan')

exports.get_percentages = async(req,res,next) =>{
    var span = req.params.span
    var cid = req.params.id
    var end_date = new Date((new Date()).setHours(23,59,59,999))
    end_date = (new Date(end_date.getTime() + Math.abs(end_date.getTimezoneOffset()*60000)))

    var ref_end = new Date((new Date()).setHours(0,0,0,0))
    ref_end = new Date(ref_end.getTime() + Math.abs(ref_end.getTimezoneOffset()*60000))
    var start_date = (new Date(ref_end.setDate(ref_end.getDate()-span)))
    
    console.log(start_date,end_date)
    
    db.query(`SELECT client_goals.*, DRIS.* FROM DRIS INNER JOIN client_goals ON DRIS.category = client_goals.category WHERE client_id = ${cid}`,async(err,dris)=>{
        if(err) {errorHandler(err,req,res,next); return next();}
        if(!dris.length) {
          res.status(404).send({message: "no goals for client"});
          return next();
        }
        var category = dris[0].category
        db.query(`SELECT * FROM dris_max WHERE category = '${dris[0].category}'`,async (err,dris_max) => {
          if(err) {errorHandler(err,req,res,next); return next();}
        
            
            var query = `SELECT meal_id,consists_of,quantities,meal_type,date,fullfilled,added,deleted FROM diet_plan WHERE client_id = ? AND date >= ? AND date<=?`
            var data = [cid,start_date,end_date]
            var info = await diet_plan(data,query,req,res,next)
             var diet_info = info[0];
             var micro_keys = info[1]

              sum_report = Object()
              
              sum_report['protein'] = 0
              sum_report['fat'] = 0;
              sum_report['carbs'] = 0;
              sum_report['calories'] = 0;

              for (var i=0; i<micro_keys.length; i++){
                sum_report[micro_keys[i]] = 0;
              }

              for (var i=0; i<diet_info.length; i++) {
                sum_report['protein'] += diet_info[i].protein
                sum_report['fat'] += diet_info[i].fat
                sum_report['carbs'] += diet_info[i].carbs
                sum_report['calories'] += diet_info[i].calories
                for (var j=0; j<micro_keys.length; j++){
                    sum_report[micro_keys[j]] += diet_info[i]['micros'][micro_keys[j]];
                  }
              }
              Object.keys(sum_report).map(function(key,index){
                if(key=="protein" || key=="fat" || key=="carbs" || key=="calories" || key == "polyunsaturated" || key == "monounsaturated" || (dris_max[0][key]==0 && key != "alcochol"))
                  sum_report[key] = {goal: dris[0][key]*span,actual: sum_report[key]}
                else if(key == "saturated")
                  sum_report[key] = {goal: dris[0][key]*span,max_goal: dris[0][key]*span,actual: sum_report[key]}
                else
                  sum_report[key] = {goal: dris[0][key]*span,max_goal: dris_max[0][key]*span,actual: sum_report[key]}
              })
            

              res.send(sum_report)
           })
          })
 }