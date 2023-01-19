var groupBy = require('lodash.groupby');
const {errorHandler} = require('../../utils/errorHandler')
const db = require('../../services/connect_db');

exports.get_client_metrics = async(req,res,next)=>{
    eid = req.user.user_id
    var height = 0;
    db.query(`SELECT client_id FROM has_client WHERE employee_id=${eid}`,(err,ids)=>{
        if(err) {errorHandler(err,req,res,next);return next()};
        if(!ids.length){
            res.send({message: "Employee doesn't have any client... yet"})
            return next()
        }
        var cids=[]
        for (var i=0; i<ids.length; i++){
            cids.push(ids[i].client_id)
        }
        db.query(`SELECT client_metrics.*, clients.height FROM clients INNER JOIN client_metrics ON clients.client_id = client_metrics.client_id WHERE clients.client_id in (${cids})`,(err,results)=>{
            if(err) {errorHandler(err,req,res,next);return next()};
            const metrics = groupBy(results, metric => metric.client_id);
            res.send(metrics)
            
    })
})
}