const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.add_food = async(req,res,next)=>{
    var nutritions = req.body.macros

    var  nkeys = Object.keys(nutritions)
    var keys = ["category","name","protein","fat","carbs","calories","alcochol","water","caffeine","sugars","fibers","calcium","ferrum","magnisium","phosphorus","potassium","natrium","zinc","copper","selinium","vitaminA","vitaminE","vitaminD","vitaminC","vitaminB1","vitaminB2","vitaminB3","vitaminB6","vitaminB12","choline","vitaminK","cholesterol","follicles","saturated","omega6","omega3","monounsaturated","polyunsaturated"]
    var info = []
    for (var i = 0; i<keys.length; i++){
        for (var j = 0; j<nkeys.length; j++){
            if(nkeys[j]==keys[i])
                info[i]=nutritions[nkeys[j]]
        }
    }
    console.log(info)
    var query = `INSERT INTO nutrition_info (category,name,protein,fat,carbs,calories,alcochol,water,caffeine,sugars,fibers,calcium,ferrum,magnisium,phosphorus,potassium,natrium,zinc,copper,selinium,vitaminA,vitaminE,vitaminD,vitaminC,vitaminB1,vitaminB2,vitaminB3,vitaminB6,vitaminB12,choline,vitaminK,cholesterol,follicles,saturated,omega6,omega3,monounsaturated,polyunsaturated) VALUES (?)`
    db.query(query,[info],(err)=>{
        if (err) {errorHandler(err,req,res,next);return next()};
        res.status(201).json({message: "food added"})
    })
}