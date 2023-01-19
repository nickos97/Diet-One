const db = require('../services/connect_db')

exports.update_customerPlan = async(client_info) =>{

    var cust_id = client_info.cust_id;
    var type = client_info.account_type;
   

    db.query(`UPDATE clients SET account_type = '${type}' WHERE customer_id = '${cust_id}'`,(err)=>{
        if(err) {console.log(err);return;}
        console.log("Customer account updated")
    })

}