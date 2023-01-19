const db = require('../services/connect_db')
const {getDiffInDays} = require('../utils/general');
const {errorHandler} = require('../utils/errorHandler');
const {get_current_date} = require('../utils/get_current_date')
const { diet_plan_app } = require('../utils/diet_plan_app');

exports.get_quantities = async (req,res,next) => {
    var cid = req.user.user_id;
    var diet_plan = await diet_plan_app(cid,req,res,next);

    var days = Object.keys(diet_plan)
    var consists;
    var index;
    unique_names = []
    quantities = []
    for (var i=0; i<days.length; i++) {
        //console.log(diet_plan[days[i]])
        for (var k=0; k<diet_plan[days[i]].length-1; k++){
        consists = diet_plan[days[i]][k].consists_of
        console.log(consists)
        
        //console.log(consists)
        for (var j=0; j<consists.length; j++) {
            if(!unique_names.includes(consists[j].food)) {
                quantities.push({name: consists[j].food, quantity: consists[j].quantity})
                unique_names.push(consists[j].food)
            }
            else {
                index = quantities.map(function(name) {return name.name}).indexOf(consists[j].food)
                quantities[index].quantity += consists[j].quantity
            }
        }
        }
    }
   
    res.send(quantities)

}