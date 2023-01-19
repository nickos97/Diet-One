const db = require('../services/connect_db')
const {getDiffInDays} = require('../utils/general');
const {errorHandler} = require('../utils/errorHandler');
const {get_current_date} = require('../utils/get_current_date')

exports.insert_metrics = async (req,res,next) => {
    var cid = req.user.user_id
    var info = req.body
    var cur_date = get_current_date()
    var thres = 8;
    var height;
    var bmi=0;
   

        var fields = [ "weight","height","waist","hips","abdomen","arm","flexed_arm","chest","thigh","gastrocnemius"]
        
        if(!fields.includes(Object.keys(req.body)[0]) || Object.keys(req.body).length>1) {
            res.status(400).send({message: "Bad request"});
            return next();
        }
        if(Object.keys(req.body)[0] == "height") {
            height = req.body.height;
            db.query(`UPDATE clients SET height = ${height} WHERE client_id = ${cid}`,(err)=>{
                if(err) {errorHandler(err,req,res,next);return next()};
                db.query(`SELECT client_metrics.*, clients.height FROM clients INNER JOIN client_metrics ON clients.client_id = client_metrics.client_id WHERE clients.client_id = ${cid}`,(err,results)=>{
                    if(err) {errorHandler(err,req,res,next);return next()};
                    var keys = Object.keys(results[0]).slice(-11)
                    var metrics = {}
                    for (var i = 0; i<keys.length; i++) {
                        metrics[keys[i]] = []
                        for (var j = 0; j<results.length; j++) {
                            metrics[keys[i]].push({value: results[j][keys[i]], date: results[j].date_measured})
                        }
                    }
                res.status(201).send(metrics)
            })
        })
        }
        else {

        if(Object.keys(req.body)[0] == "weight"){
            
            db.query(`SELECT height FROM clients WHERE  client_id = ${cid}`,(err,results)=>{
                if(err) {errorHandler(err,req,res,next);return next()};
        
                if(results[0].height){
                    height = results[0].height
                    bmi = parseFloat((req.body.weight / Math.pow(height/100,2)).toFixed(1))
                    
                }
                req.body.bmi = bmi;
            })
        }
        var ddate = new Date();
        ddate.setDate(ddate.getDate() - 7);

        var finalDate = ddate.getFullYear() + '-' + (ddate.getMonth()+1 + '-' + ddate.getDate());
        
        db.query(`SELECT * FROM client_metrics WHERE client_id = ${cid} AND date_measured <='${cur_date}' AND date_measured > '${finalDate}'`,(err,date)=>{
            if(err) {errorHandler(err,req,res,next);return next()};
           
            
            if(!date.length) {
                
            var query = 'INSERT INTO client_metrics (client_id,date_measured) VALUES (?,?)'
            db.query(query,[cid,cur_date],(err)=>{
                if(err) {errorHandler(err,req,res,next);return next()};

                db.query(`UPDATE client_metrics SET ? WHERE client_id = ${cid} AND date_measured = '${cur_date}' `,info,(err)=>{
                    if(err) {errorHandler(err,req,res,next);return next()};
                    db.query(`SELECT client_metrics.*, clients.height FROM clients INNER JOIN client_metrics ON clients.client_id = client_metrics.client_id WHERE clients.client_id = ${cid}`,(err,results)=>{
                        if(err) {errorHandler(err,req,res,next);return next()};
                        var keys = Object.keys(results[0]).slice(-11)
                        var metrics = {}
                        for (var i = 0; i<keys.length; i++) {
                            metrics[keys[i]] = []
                            for (var j = 0; j<results.length; j++) {
                                metrics[keys[i]].push({value: results[j][keys[i]], date: results[j].date_measured})
                            }
                        }
                        res.status(201).send(metrics)
                })
                })
            })
            }

            else {
                db.query(`UPDATE client_metrics SET ? WHERE client_id = ${cid} AND date_measured = '${cur_date}' `,info,(err)=>{
                    if(err) {errorHandler(err,req,res,next);return next()};
                    db.query(`SELECT client_metrics.*, clients.height FROM clients INNER JOIN client_metrics ON clients.client_id = client_metrics.client_id WHERE clients.client_id = ${cid}`,(err,results)=>{
                        if(err) {errorHandler(err,req,res,next);return next()};
                        var keys = Object.keys(results[0]).slice(-11)
                        var metrics = {}
                        for (var i = 0; i<keys.length; i++) {
                            metrics[keys[i]] = []
                            for (var j = 0; j<results.length; j++) {
                                metrics[keys[i]].push({value: results[j][keys[i]], date: results[j].date_measured})
                            }
                        }
                        res.status(201).send(metrics)
                })
                })
            }
})
        }
    
}