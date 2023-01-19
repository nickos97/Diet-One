const db = require('../services/connect_db');
const {errorHandler} = require('../utils/errorHandler');

exports.view_metrics = async (req,res,next) => {
    var cid = req.user.user_id
    var height = 0;
    var query = 'SELECT client_metrics.*, clients.height FROM clients INNER JOIN client_metrics ON clients.client_id = client_metrics.client_id WHERE clients.client_id = ?'
    db.query(query,cid,(err,results)=>{
        if(err) {errorHandler(err,req,res,next);return next()};
        
        var keys = Object.keys(results[0]).slice(-11)
        var metrics = {}
        for (var i = 0; i<keys.length; i++) {
            metrics[keys[i]] = []
            for (var j = 0; j<results.length; j++) {
                metrics[keys[i]].push({value: results[j][keys[i]], date: results[j].date_measured})
            }
        }
        res.send(metrics)
        
    })
}