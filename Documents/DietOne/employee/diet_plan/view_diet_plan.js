const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');
const {meal_object,calculate_macros,calculate_micros} =require('../../utils/general')
const {diet_plan} = require('../../utils/diet_plan');
exports.view_diet_plan = async(req,res,next)=>{

    var cid = parseInt(req.body.client_id)
    var date = req.body.date
    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var query = "";
    var data;

        if(Object.keys(req.body).length<2){
            query = `SELECT meal_id,consists_of,quantities,meal_type,date,fullfilled,added,deleted,comments FROM diet_plan WHERE client_id = ?`
            data = [cid]
        }
        else if(start_date && end_date){
            query = `SELECT meal_id,consists_of,quantities,meal_type,date,fullfilled,added,deleted,comments FROM diet_plan WHERE client_id = ? AND date >= ? AND date <= ?`
            data = [cid,start_date,end_date];
        }
        else if(date){
            query = `SELECT meal_id,consists_of,quantities,meal_type,date,fullfilled,added,deleted,comments FROM diet_plan WHERE client_id = ? AND date = ?`
            data = [cid,date]
        }
            var info = await(diet_plan(data,query,req,res,next))
            
            var diet_info = info[0]
            res.send(diet_info)
        
      
    
          
}