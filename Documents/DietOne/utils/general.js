const db = require('../services/connect_db');
const {errorHandler} = require('./errorHandler');
exports.calculateAge = (a) => {

    if(a==null) return null;
    // Discard the time and time-zone information.
    let b = new Date()
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24 * 365));
  }

exports.getDiffInDays = (a) => {
    // Discard the time and time-zone information.
    let b = new Date()
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
  }

  exports.search_bar = async(req,res,next)=>{
    let keyword1="% " + req.body.keyword + "%"
    let keyword2=req.body.keyword + "%"
    let keywords = []
    let query = ""
    if(req.body.keyword.split(" ").length) {
      
      query = "SELECT * FROM nutrition_info WHERE name like ?"
      constring = "AND name like ?"
      for(var i=0; i<req.body.keyword.split(" ").length; i++) {
        keywords.push("%"+req.body.keyword.split(" ")[i]+"%")
        if(i>0) query += constring
      }
    }
    else {
      query = "SELECT * FROM nutrition_info WHERE name like ? OR name like ?"
      keywords=[keyword1,keyword2]
    }
    db.query(query,keywords,(err,results)=>{
        if(err) {errorHandler(err,req,res,next);return next()}
        res.send(results.sort((a,b)=>a['name'].length-b['name'].length))
    })
}

exports.calculate_macros = (micro,quantity) =>{
  micro = (micro/100)*quantity
  return micro
}

exports.calculate_micros = (micro,quantity) =>{
  micro = (micro/100)*quantity
  return micro
}

exports.meal_object = (sums,food_names,food_labels,quantities,mids,cals,protein,fat,carbs,codes,micros)=>{
    var counter = 0
    final_meals = []
    mkeys = Object.keys(micros)
    for (var i=0; i<sums.length; i++) { //sums.length: sum of meals
        var consists_of = []
        var total_cals = 0
        var total_protein = 0
        var total_fat = 0
        var total_carbs = 0
        
        var total_micros = {}
        for (var k=0; k<mkeys.length; k++){
            total_micros[mkeys[k]] = 0
        }
        for (var j=0; j<sums[i]; j++){ //sum[i]: sum of foods per meal
            var sep_micros = Object()
            total_cals += cals[counter]
            total_protein += protein[counter]
            total_fat += fat[counter]
            total_carbs += carbs[counter]
            for (var k=0; k<mkeys.length; k++){
              total_micros[mkeys[k]] += micros[mkeys[k]][counter]
              sep_micros[mkeys[k]] = micros[mkeys[k]][counter]
            }
            consists_of.push({food: food_names[counter],label: food_labels[counter],quantity: quantities[counter],code: codes[counter],
              calories: cals[counter],protein: protein[counter],fat:fat[counter],carbs: carbs[counter],micros: sep_micros})
            
            counter +=1
        }
        //console.log(total_micros)
  
        final_meals.push({meal_id: mids[i],calories: total_cals,
                protein: total_protein, fat: total_fat, carbs: total_carbs, micros: total_micros,consists_of:consists_of})
    }
    //console.log(total_micros)
    return final_meals
}

exports.float2 = (value) =>{
  return parseFloat(value.toFixed(2))
}

exports.meal_object_app = (sums,food_names,food_labels,quantities,mids,cals,protein,fat,carbs,codes,micros,fullfilled,comments) => {
  console.log(comments)
  var counter = 0
    final_meals = []
    mkeys = Object.keys(micros)
    for (var i=0; i<sums.length; i++) { //sums.length: sum of meals
        var consists_of = []
        var total_cals = 0
        var total_protein = 0
        var total_fat = 0
        var total_carbs = 0
        
        var total_micros = {}
        for (var k=0; k<mkeys.length; k++){
            total_micros[mkeys[k]] = 0
        }
        for (var j=0; j<sums[i]; j++){ //sum[i]: sum of foods per meal
            var sep_micros = Object()
            total_cals += cals[counter]
            total_protein += protein[counter]
            total_fat += fat[counter]
            total_carbs += carbs[counter]
            for (var k=0; k<mkeys.length; k++){
              total_micros[mkeys[k]] += micros[mkeys[k]][counter]
              sep_micros[mkeys[k]] = micros[mkeys[k]][counter]
            }
            consists_of.push({food: food_names[counter],label:food_labels[counter],quantity: quantities[counter],code: codes[counter],
              calories: cals[counter],protein: protein[counter],fat:fat[counter],carbs: carbs[counter],micros: sep_micros,fullfilled: fullfilled[counter]})
            
            counter +=1
        }
        //console.log(total_micros)
  
        final_meals.push({meal_id: mids[i],comment: comments[i],calories: total_cals,
                protein: total_protein, fat: total_fat, carbs: total_carbs, micros: total_micros,consists_of:consists_of})
    }
    //console.log(total_micros)
    return final_meals
}




