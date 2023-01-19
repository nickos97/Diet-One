const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');
const {meal_object,calculate_macros} =require('../../utils/general')


exports.retrieve_meals = async(req,res,next)=>{

    db.query(`SELECT * FROM meal_repo`,(err,meals)=>{
        if(err) {errorHandler(err,req,res,next);return next()};

        if(!meals.length){
            res.send("no meals created!!!")
            return next()
        }

        var meal_names = []
        var mids = []
        var food_names = []
        var food_labels = []
        var codes = []
        var quantities = []
        var sums = []
        var final_meals = []
        var cals = []
        var protein = []
        var fat = []
        var carbs = []
        var micros = Object()

        for(var i=0; i<meals.length; i++) {
            sums.push(meals[i].codes.split(",").length) //sums: [sum of foods per meal] 
            mids.push(meals[i].rmeal_id)
            meal_names.push(meals[i].name)
            for (var j=0; j<sums[i]; j++){
                codes.push(parseInt(meals[i].codes.split(",")[j]))
                quantities.push(parseInt(meals[i].quantities.split(",")[j]))
            }
        }
        db.query(`SELECT * FROM nutrition_info WHERE code IN (${codes})`,(err,names)=>{
             if(err) {errorHandler(err,req,res,next);return next()};
             var micro_keys = Object.keys(names[0]).splice(7,33)
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
                            micros[micro_keys[k]].push(calculate_macros(names[j][micro_keys[k]],quantities[i]))
                        }
                    }
                }
            }
            
            console.log(meal_names)
            
            final_meals = meal_object(sums,food_names,food_labels,quantities,mids,cals,protein,fat,carbs,codes,micros)
            for (var i =0; i<final_meals.length; i++) {
                final_meals[i]['meal_name'] = meal_names[i]
            }
            res.send(final_meals)
         })
    })
}