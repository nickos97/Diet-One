const {errorHandler} = require('../utils/errorHandler');
const db = require('../services/connect_db');
const { diet_plan_app } = require('../utils/diet_plan_app');

exports.edit_diet = async(req,res,next)=>{

    var cid = req.user.user_id;
    var consists = req.body.consists_of.toString();
    var quantities = req.body.quantities.toString();
    var data = [cid,consists,quantities,req.body.meal_type,req.body.date,(new Array(req.body.quantities.length).fill(0)).toString()]

    db.query(`SELECT meal_id,fullfilled,consists_of,quantities FROM diet_plan WHERE meal_type = '${req.body.meal_type}' AND date = '${req.body.date}' AND client_id = '${cid}'`,(err,results)=>{
        if(err) {errorHandler(err,req,res,next);return next()}
    
    if(results.length) {
            
            var new_fullfilled = []
            var new_consists = []
            var new_quantities = []
            var arr1 = req.body.consists_of
            var arr2 = []
            var old_fullilled = []
            var quantities = req.body.quantities;
            
            results[0].consists_of.split(",").forEach(element=> arr2.push(parseInt(element)))
            results[0].fullfilled.split(",").forEach(element=> old_fullilled.push(parseInt(element)))
            var intersection = arr1.filter(x => arr2.includes(x));
            var difference = arr1.filter(x => !arr2.includes(x));
            var difference1 = arr2.filter(x => !arr1.includes(x));
            console.log("difference",difference1)

            for (var i=0; i<intersection.length; i++){
                let consists_index = arr2.indexOf(intersection[i])
                let fullilled = old_fullilled[consists_index]
                new_consists.push(intersection[i])
                new_fullfilled.push(fullilled)
            }
            for (var i = 0; i<difference.length; i++) {
               new_consists.push(difference[i]);
               new_fullfilled.push(0)
            }
            
            for (var i = 0; i<new_consists.length; i++){
                let index = req.body.consists_of.indexOf(new_consists[i])
                new_quantities.push(quantities[index])
            }

            console.log(new_consists,new_quantities,new_fullfilled)
            db.query(`UPDATE diet_plan SET consists_of = '${new_consists.toString()}', quantities = '${new_quantities.toString()}', fullfilled = '${new_fullfilled.toString()}' WHERE meal_id = ${results[0].meal_id}`,async (err)=>{
                if(err) {errorHandler(err,req,res,next);return next()};
                if(arr1.length>arr2.length){ //add
                    db.query(`SELECT deleted FROM diet_plan WHERE meal_id = ${results[0].meal_id}`,(err,food_deleted)=>{
                        if(err) {errorHandler(err,req,res,next);return next()};
                        var ids = food_deleted[0].deleted.slice(1).split(",");
                        console.log(ids);
                        if(!ids.includes(difference[0].toString())){
                            db.query(`UPDATE diet_plan SET added=CONCAT(added,',${difference[0].toString()}') WHERE  meal_id=${results[0].meal_id}`,(err)=>{
                                if(err) {errorHandler(err,req,res,next);return next()};
                            })
                        }
                        else {

                            var newDeleted = ids.filter(id => id != difference[0].toString());
                            var string="";
                            
                            if(newDeleted.length){
                                string = `,${newDeleted.toString()}`
                            }
                            db.query(`UPDATE diet_plan SET deleted = '${string}' WHERE meal_id = ${results[0].meal_id}`,(err)=>{
                                if(err) {errorHandler(err,req,res,next);return next()};
                            })
                        }
                    })

                }


                else { //delete
                    db.query(`SELECT added FROM diet_plan WHERE meal_id = ${results[0].meal_id}`,(err,food_added)=>{
                        if(err) {errorHandler(err,req,res,next);return next()};
                        var ids = food_added[0].added.slice(1).split(",");
                        console.log(ids);
                        if(!ids.includes(difference1[0].toString())){
                            db.query(`UPDATE diet_plan SET deleted=CONCAT(deleted,',${difference1[0].toString()}') WHERE  meal_id=${results[0].meal_id}`,(err)=>{
                                if(err) {errorHandler(err,req,res,next);return next()};
                            })
                        }
                        else {

                            var newAdded = ids.filter(id => id != difference1[0].toString());
                            var string="";
                            if(newAdded.length){
                                string = `,${newAdded.toString()}`
                            }
                            db.query(`UPDATE diet_plan SET added = '${string}' WHERE meal_id = ${results[0].meal_id}`,(err)=>{
                                if(err) {errorHandler(err,req,res,next);return next()};
                            })
                        }

                    })
                    
                }
                    db.query(`SELECT consists_of FROM diet_plan WHERE meal_id = ${results[0].meal_id}`,async (err,consists)=>{
                        if(err) {errorHandler(err,req,res,next);return next()};
                        if(!consists[0].consists_of.length){
                            db.query(`DELETE FROM diet_plan WHERE meal_id = ${results[0].meal_id}`,async (err)=>{
                                if(err) {errorHandler(err,req,res,next);return next()};
                                var diet_plan = await diet_plan_app(cid,req,res,next);
                                res.status(201).send(diet_plan)
                            })
                        }
                        else {
                                var diet_plan = await diet_plan_app(cid,req,res,next);
                                res.status(201).send(diet_plan)
                        }
                    
                        
                    })
            })
    }


    
    else{
    console.log(data)
    meal_types = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner']
    if (!meal_types.includes(req.body.meal_type)) {
        res.send("Invalid meal_type")
            return next()
    }

    db.query(`SELECT * FROM clients WHERE client_id = ${cid}`,(err,results)=>{
        if(err) {errorHandler(err,req,res,next);return next()};

        if(!results.length) {
            res.send("Invalid client id")
            return next()
        }
    
    
            db.query(`INSERT INTO diet_plan (client_id,consists_of,quantities,meal_type,date,fullfilled) VALUES (?,?,?,?,?,?)`,data,async (err)=>{
                if(err) {errorHandler(err,req,res,next);return next()};
                var diet_plan = await diet_plan_app(cid,req,res,next);
                res.status(200).send(diet_plan)
            })
        })
    }
    })




}