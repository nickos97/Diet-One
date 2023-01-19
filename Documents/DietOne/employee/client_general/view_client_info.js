const {errorHandler} = require('../../utils/errorHandler');
const db = require('../../services/connect_db');
const {calculateAge} = require('../../utils/general')

exports.view_client_info = async(req,res,next)=>{
    var eid = req.user.user_id;
    var role = req.user.user_type;
    var query;

    if(role=="admin")
        query = 'SELECT users.email, clients.* FROM clients INNER JOIN users ON clients.client_id = users.user_id';
    if(role == "employee")
        query = 'SELECT users.email, clients.* FROM clients INNER JOIN users ON clients.client_id = users.user_id WHERE user_id in (SELECT client_id FROM has_client WHERE employee_id = ?)'
        db.query(query,[eid],(err,results)=>{
            if (err) {errorHandler(err,req,res,next);return next()};
        
            results.forEach(client=> client["age"] = calculateAge(client["birth_date"]))
            
            res.send(results)
       
        })
}