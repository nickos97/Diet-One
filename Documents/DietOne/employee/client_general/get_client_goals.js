const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');

exports.get_client_goals = async(req,res,next)=>{
    var cid = req.params.id
    var client_goals = Object()
    db.query(`SELECT * FROM client_goals WHERE client_id = ${cid}`,(err,goals)=>{
        if(err) {errorHandler(err,req,res,next); return next();}
        if(!goals.length) {res.send({message: "Client goals haven't been set yet"}); return next()}

        var cat = goals[0].category
        db.query(`SELECT * FROM DRIS WHERE category = '${cat}'`,(err,micro_goals)=>{
            if(err) {errorHandler(err,req,res,next); return next();}
            delete goals[0].category; delete micro_goals[0].category;
          
            micro_goals[0].saturated = goals[0].saturated;
            micro_goals[0].monounsaturated = goals[0].monounsaturated;
            micro_goals[0].polyunsaturated = goals[0].polyunsaturated;

            delete goals[0].saturated; delete goals[0].monounsaturated; delete goals[0].polyunsaturated;

            client_goals.client_id = goals[0].client_id;
            delete goals[0].client_id;
            client_goals.macros = goals[0];
            client_goals.micros = micro_goals[0];

            res.status(200).send(client_goals)
        })


    })
}