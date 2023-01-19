const {errorHandler} = require('./errorHandler');
const db = require('../services/connect_db');
const {meal_object,calculate_macros,calculate_micros,meal_object_app} =require('./general')

exports.diet_plan = async(data,query,req,res,next) =>{
    return new Promise((resolve)=>{
    
          
          db.query(query,data,(err,diet_info)=>{
              if(err) {errorHandler(err,req,res,next);return next()};
              
              if(!diet_info.length){
                  res.status(404).send("Client has no meals")
                  return next()
              }
              meal_ids = []
              for (var i=0; i<diet_info.length; i++){
                  meal_ids.push(diet_info[i].meal_id)
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
        var added = {}
        var deleted = {}
        var allCodes = []
        var mid;

          /* Added - deleted utility */

        for (var i = 0; i<diet_info.length; i++){
            mid = diet_info[i].meal_id;
            if(diet_info[i].added.length){
                
                added[mid] = {"codes": [],"names": []}
                for(var j = 0; j< diet_info[i].added.slice(1).split(",").length; j++){
                added[mid].codes.push(parseInt(diet_info[i].added.slice(1).split(",")[j]))
                allCodes.push(parseInt(diet_info[i].added.slice(1).split(",")[j]))
                }
            }
            if(diet_info[i].deleted.length){
                
                deleted[mid] = {"codes": [],"names": []}
                for(var j = 0; j< diet_info[i].deleted.slice(1).split(",").length; j++){
                    deleted[mid].codes.push(parseInt(diet_info[i].deleted.slice(1).split(",")[j]));
                    allCodes.push(parseInt(diet_info[i].deleted.slice(1).split(",")[j]))
                }
            }
        }
        
        var addKeys = Object.keys(added);
        var delKeys = Object.keys(deleted);
        if(!allCodes.length) {
            allCodes.push(123123)
        }
        db.query(`SELECT code,name FROM nutrition_info WHERE code IN (${allCodes})`,(err,codeNames)=>{
            if(err) {errorHandler(err,req,res,next);return next()};

                codeNames.forEach((elem) => {
                    for(var i=0; i<addKeys.length; i++){
                        if(added[addKeys[i]].codes.includes(elem.code)){
                            added[addKeys[i]].names.push(elem.name)
                        }
                    }
                    for(var j=0; j<delKeys.length; j++){
                        if(deleted[delKeys[j]].codes.includes(elem.code)){
                            deleted[delKeys[j]].names.push(elem.name)
                        }
                    }
                })
        
                console.log(added)
                console.log(deleted)
        /* Added - deleted utility */

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

               delete diet_info[i].fullfilled;
               delete diet_info[i].added;
               delete diet_info[i].deleted;
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
              
              diet_info = Object(diet_info)
              for (var i=0; i<diet_info.length; i++){
                  
                for(var a = 0; a<addKeys; a++){
                    if(diet_info[i].meal_id == parseInt(addKeys[a])){
                        diet_info[i]["added"] = added[addKeys[a]].names
                    }
                }

                for(var d = 0; d<delKeys; d++){
                    if(diet_info[i].meal_id == parseInt(delKeys[d])){
                        diet_info[i]["deleted"] = deleted[delKeys[d]].names
                    }
                }
                  
                  delete diet_info[i].quantities;
                  delete diet_info[i].consists_of;
                  for (var j=0; j<final_meals.length; j++) {
                      if(diet_info[i].meal_id==final_meals[j].meal_id){
                          diet_info[i].calories = final_meals[j].calories
                          diet_info[i].protein = final_meals[j].protein
                          diet_info[i].fat = final_meals[j].fat
                          diet_info[i].carbs = final_meals[j].carbs
                          diet_info[i].micros = final_meals[j].micros
                          diet_info[i].consists_of = final_meals[j].consists_of
                      }
                  }
              }
              var fullfill_day = 0
              var fullfill_meal = 0
              var foods;
              for (var i = 0; i<diet_info.length; i++){ //iterate meals
                    foods = diet_info[i].consists_of
                    fullfill_meal = 1
                for(var j=0; j<foods.length; j++){ //iterate foods of meal
                    if(!foods[j].fullfilled)
                        fullfill_meal = 0
                }
                if(fullfill_meal) 
                    diet_info[i].meal_fullfilled = 1
                else 
                    diet_info[i].meal_fullfilled = 0
              }
              resolve([diet_info,micro_keys])
           })
              })
            })   
        })
  }