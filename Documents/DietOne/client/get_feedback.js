const db = require('../services/connect_db')
const {errorHandler} = require('../utils/errorHandler');
const { diet_plan_app } = require('../utils/diet_plan_app');
const {float2} = require('../utils/general')

exports.get_feedback = async(req,res,next) =>{

    var cid = req.user.user_id
    var date = req.params.date;

    db.query(`SELECT client_goals.*, DRIS.* FROM DRIS INNER JOIN client_goals ON DRIS.category = client_goals.category WHERE client_id = ${cid}`,async(err,dris)=>{
        
        if(err) {errorHandler(err,req,res,next); return next();}

        if(!dris.length) {
          res.status(404).send({message: "no goals for client"});
          return next();
        }
        db.query(`SELECT * FROM dris_max WHERE category = '${dris[0].category}'`,async (err,dris_max) => {
            if(err) {errorHandler(err,req,res,next); return next();}
            var diet =  await diet_plan_app(cid,req,res,next);
            var filtered_diet = Object.keys(diet).
                filter((key) => key==new Date(date).toString()).
                reduce((cur, key) => { return Object.assign(cur, { [key]: diet[key] })}, {});
        
            var day_diet = filtered_diet[Object.keys(filtered_diet)[0]]

            if(!day_diet) {
                res.status(404).send({message: "Invalid date"})
                return next()
            }
        
        var sums = Object();
        micro_keys = Object.keys(day_diet[0].consists_of[0].micros)
        

        sums['calories']=0
        sums['protein']=0
        sums['fat']=0
        sums['carbs']=0

        for (var i=0; i<micro_keys.length; i++){
            sums[micro_keys[i]]=0;
        }

        for (var i = 0; i<day_diet.length-1; i++) {
            for (var j = 0; j<day_diet[i].consists_of.length; j++){
                if(day_diet[i].consists_of[j].fullfilled){
                    sums["calories"] += day_diet[i].consists_of[j].calories
                    sums["protein"] += day_diet[i].consists_of[j].protein
                    sums["fat"] += day_diet[i].consists_of[j].fat
                    sums["carbs"] += day_diet[i].consists_of[j].carbs
                    for(var k = 0; k<micro_keys.length; k++){
                        sums[micro_keys[k]] += day_diet[i].consists_of[j].micros[micro_keys[k]]
                    }

                }
            }
        }

        var final_feedback = Object()
        dris_keys = Object.keys(dris[0]);
        dris_keys.splice(0,2)
        
        
        
        for (var i=0; i<dris_keys.length; i++){
            
            if(dris_keys[i]=="protein" ||dris_keys[i]=="fat" || dris_keys[i]=="carbs"
             || dris_keys[i]=="calories" || dris_keys[i] == "polyunsaturated" 
             || dris_keys[i] == "monounsaturated" || (dris_max[0][dris_keys[i]]==0 && dris_keys[i] != "alcochol")) {

                final_feedback[dris_keys[i]] = Object()
                final_feedback[dris_keys[i]]['goal'] = dris[0][dris_keys[i]]
                //console.log(sums[micro_keys[i]])
                final_feedback[dris_keys[i]]['actual'] = parseInt(sums[dris_keys[i]].toFixed())
                final_feedback[dris_keys[i]]['percentage'] = float2(sums[dris_keys[i]]/dris[0][dris_keys[i]])
                
            }
            else if(dris_keys[i]=="saturated") {
                final_feedback[dris_keys[i]] = Object()
                final_feedback[dris_keys[i]]['goal'] = dris[0][dris_keys[i]]
                //console.log(sums[micro_keys[i]])
                final_feedback[dris_keys[i]]['actual'] = parseInt(sums[dris_keys[i]].toFixed())
                final_feedback[dris_keys[i]]['percentage'] = float2(sums[dris_keys[i]]/dris[0][dris_keys[i]])
                
            }
           
            else {
                final_feedback[dris_keys[i]] = Object()
                final_feedback[dris_keys[i]]['goal'] = dris[0][dris_keys[i]]
                final_feedback[dris_keys[i]]['max_goal'] = dris_max[0][dris_keys[i]]
                final_feedback[dris_keys[i]]['actual'] = parseInt(sums[dris_keys[i]].toFixed())
                final_feedback[dris_keys[i]]['percentage'] = float2(sums[dris_keys[i]]/dris[0][dris_keys[i]])

            }
        }
        final_feedback["cholesterol"]["percentage"] /= 1000

        res.send(final_feedback)
    
    
    })
})

}