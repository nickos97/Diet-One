const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');
const {meal_object,calculate_macros,calculate_micros,float2} =require('../../utils/general')
var groupBy = require('lodash.groupby');
const {diet_plan} = require('../../utils/diet_plan')
const {get_current_date} = require('../../utils/get_current_date')

exports.get_client_feed = async(req,res,next) => {
    var cid = req.params.id;
    var date = req.params.date;
    var span = req.params.span
    console.log(span)
    var curDate = get_current_date()

    var endDate = new Date(Date.now(curDate) - span * 24 * 60 * 60 * 1000);
    var dd = String(endDate.getDate()).padStart(2, '0');
    var mm = String(endDate.getMonth() + 1).padStart(2, '0'); 
    var yyyy = endDate.getFullYear();


    endDate = yyyy + '-' + mm + '-' + dd;

    console.log(endDate, curDate)

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
            var data = [cid,endDate,curDate]
            var info = await diet_plan(data,query,req,res,next)
             var diet_info = info[0];
             var micro_keys = info[1]

              var sum_report = Object()
              var meal;

              sum_report['protein'] = 0
              sum_report['fat'] = 0;
              sum_report['carbs'] = 0;
              sum_report['calories'] = 0;
            
              for (var i=0; i<micro_keys.length; i++){
                sum_report[micro_keys[i]] = 0;
              }

              for (var i=0; i<diet_info.length; i++) {
                meal = diet_info[i]
                for (var j = 0 ; j<meal.consists_of.length; j++){

                    if(meal.consists_of[j].fullfilled) {
                        sum_report['protein'] += meal.consists_of[j].protein
                        sum_report['fat'] += meal.consists_of[j].fat
                        sum_report['carbs'] += meal.consists_of[j].carbs
                        sum_report['calories'] += meal.consists_of[j].calories
                        for (var k=0; k<micro_keys.length; k++){
                            sum_report[micro_keys[k]] += meal['micros'][micro_keys[k]];
                        }
                    }
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
            
              sum_report["cholesterol"]["actual"]/=1000  
              res.send(sum_report)
           })
          })
}