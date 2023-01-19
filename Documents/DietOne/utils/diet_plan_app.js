require('dotenv').config()
const db = require('../services/connect_db')
const {meal_object_app,meal_object,calculate_macros,calculate_micros} = require('../utils/general')
const {errorHandler} = require('./errorHandler');
const {get_week_days} = require('./get_week_days');
const groupBy = require('lodash.groupby');

exports.diet_plan_app = async(cid,req,res,next) =>{

    return new Promise((resolve)=>{

    var start_end = get_week_days()
    start_date = start_end[0]
    end_date = start_end[1]
    
    var query = `SELECT meal_id,consists_of,quantities,meal_type,date,fullfilled,comments FROM diet_plan WHERE client_id = ? AND date >= ? AND date<=?`

    db.query(query,[cid,start_date,end_date],(err,diet_info) =>{
        if(err) {errorHandler(err,req,res,next); return next();}
        //res.send(diet);
        if(!diet_info.length){
            res.status(404).send("Client has no meals")
            return next()
        }
            
    var mids = []
    var comments = []
    var food_names = []
    var food_labels = []
    var codes = []
    var quantities = []
    var fullfilled = []
    var sums = []
    var final_meals = []
    var cals = []
    var protein = []
    var fat = []
    var carbs = []
    var micros = Object()

    for(var i=0; i<diet_info.length; i++) {
        sums.push(diet_info[i].consists_of.split(",").length) //sums: [sum of foods per meal] 
        mids.push(diet_info[i].meal_id)
        comments.push(diet_info[i].comments)
        for (var j=0; j<sums[i]; j++){
            codes.push(parseInt(diet_info[i].consists_of.split(",")[j]))
            quantities.push(parseInt(diet_info[i].quantities.split(",")[j]))
            fullfilled.push(parseInt(diet_info[i].fullfilled.split(",")[j]))
        }
    }
    db.query(`SELECT * FROM nutrition_info WHERE code IN (${codes})`,(err,names)=>{
         if(err) {errorHandler(err,req,res,next);return next()};

         var micro_keys = Object.keys(names[0]).splice(8,32)
        
         for (var k=0; k<micro_keys.length; k++){
            micros[micro_keys[k]]=[]
        }

        for (var i=0; i<codes.length; i++){
            for (var j=0; j<names.length; j++){
                if(codes[i]==names[j].code){
                    food_names.push(names[j].name)
                    food_labels.push(names[j].label)
                    cals.push(calculate_macros(names[j]['calories'],quantities[i]))
                          protein.push(calculate_macros(names[j]['protein'],quantities[i]))
                          fat.push(calculate_macros(names[j]['fat'],quantities[i]))
                          carbs.push(calculate_macros(names[j]['carbs'],quantities[i]))
                          for (var k=0; k<micro_keys.length; k++){
                              micros[micro_keys[k]].push(calculate_micros(names[j][micro_keys[k]],quantities[i]))
                          }
                }
            }
        }
       
        final_meals = meal_object_app(sums,food_names,food_labels,quantities,mids,cals,protein,fat,carbs,codes,micros,fullfilled,comments)
        //final_meals = meal_object(sums,food_names,quantities,mids,cals,protein,fat,carbs,codes,micros,fullfilled)

        diet_info.forEach((meal,i) =>{
            final_meals[i].meal_type = diet_info[i].meal_type
            final_meals[i].date = diet_info[i].date
        })
        var types = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner']
        var tmp_types=[]
        var diet_plan = groupBy(final_meals, meal => meal.date)
        var date_keys = Object.keys(diet_plan)
        var fullfill_day = 0
        var fullfill_meal = 0
        for(var i=0; i<date_keys.length; i++){ //iterate days
            fullfill_day = 1
            tmp_types = []
            for(var j=0; j<diet_plan[date_keys[i]].length; j++){ //iterate meals of day
                tmp_types.push(diet_plan[date_keys[i]][j].meal_type)
                fullfill_meal = 1
                for (var k=0; k<diet_plan[date_keys[i]][j].consists_of.length; k++){ //iterate foods of meal
                    if(!diet_plan[date_keys[i]][j].consists_of[k].fullfilled)
                        fullfill_meal = 0
                }
                diet_plan[date_keys[i]][j].meal_fullfilled = fullfill_meal
                if(!fullfill_meal) fullfill_day = 0
            }
            
                for(var l=0; l<types.length; l++){
                    if(!tmp_types.includes(types[l])){
                        diet_plan[date_keys[i]].unshift({"meal_type":types[l],"consists_of": []})
                    }
                }
            
            diet_plan[date_keys[i]].push({day_fullfilled: fullfill_day})
        }

        resolve(diet_plan)
     })
          
    })
})
}