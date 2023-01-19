const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');
const {calculate_macros} = require('../../utils/general')

exports.meal_by_id = async(req,res,next)=>{
    var mid = req.params.id

    db.query(`SELECT * FROM meal_repo WHERE rmeal_id=${mid}`,(err,meal)=>{
        if(err) {errorHandler(err,req,res,next);return next()};

        if(!meal.length){
            res.status(404).send({message: "Invalid meal_id"})
            return next()
        }
        var codes=[]
        var quantities = []
        var name = meal[0].name
        for(var i=0; i<meal[0].codes.split(",").length; i++){
            codes.push(parseInt(meal[0].codes.split(",")[i]))
            quantities.push(parseInt(meal[0].quantities.split(",")[i]))
        }
        db.query(`SELECT * FROM nutrition_info WHERE code IN (${codes})`,(err,info)=>{
            if(err) {errorHandler(err,req,res,next);return next()};
            var consists_of = []
            var cals = 0
            var protein = 0
            var fat = 0
            var carbs = 0
            var micros = Object()
            
            var micro_keys = Object.keys(info[0]).splice(7,33)
             
            for (var k=0; k<micro_keys.length; k++){
                micros[micro_keys[k]]=0
            }

        
        codes.forEach((code,j)=>{
            var sep_micros = Object()
                cals += calculate_macros(info[j]['calories'],quantities[j])
                protein += calculate_macros(info[j]['protein'],quantities[j])
                fat += calculate_macros(info[j]['fat'],quantities[j])
                carbs += calculate_macros(info[j]['carbs'],quantities[j])
                for (var k=0; k<micro_keys.length; k++){
                    micros[micro_keys[k]]+=calculate_macros(info[j][micro_keys[k]],quantities[j])
                    sep_micros[micro_keys[k]] = calculate_macros(info[j][micro_keys[k]],quantities[j])
                }
                consists_of.push({name: info[j].name,quantity: quantities[j],
                    calories: calculate_macros(info[j]['calories'],quantities[j]),
                    protein: calculate_macros(info[j]['protein'],quantities[j]),
                    fat: calculate_macros(info[j]['fat'],quantities[j]),
                    carbs: calculate_macros(info[j]['carbs'],quantities[j]),
                    micros: sep_micros }) 
            
        })
    
            meal_obj = {meal_id: mid,name: name, calories: cals, protein: protein, fat: fat, carbs: carbs,micros: micros, consists_of: consists_of}

        res.send(meal_obj)
        })
    })

}