const db = require('../services/connect_db')
const {errorHandler} = require('../utils/errorHandler');

exports.update_customerId = async(update_info) => {
    //return new Promise((resolve)=>{

   
    var cust_id = update_info.cust_id;
    var email = update_info.email;
    db.query(`SELECT user_id FROM users WHERE email = '${email}'`,(err,user_id)=>{
        if(err) {console.log(err);return;}
    if(user_id.length){

    var client_id = user_id[0].user_id;

    db.query(`UPDATE clients SET customer_id = '${cust_id}' WHERE client_id = '${client_id}'`,(err)=>{
        if(err) {console.log(err);return;}
        console.log("Customer id updated")
    })
}
})
//})

}