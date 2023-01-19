const {errorHandler} = require('../utils/errorHandler');
const db = require('../services/connect_db');
const e = require('express');

exports.assign_client = (cid) =>{
    
    db.query(`SELECT * FROM has_client WHERE client_id = ${cid}`,(err,relation)=>{

        if(err) {errorHandler(err,req,res,next);return next()};
        if(relation.length){
            console.log("client has already an employee")
            return
        }
        
        db.query(`SELECT * FROM employees`,(err,employees)=>{
            if(err) {errorHandler(err,req,res,next);return next()};

            const min_count = Math.min(...employees.map(item => item.client_count))
            var empids = employees.filter(employee => employee.client_count == min_count)
            var ticket = Math.floor(Math.random()*empids.length)
            winner_id = empids[ticket].employee_id
            console.log(`The employee with the id: ${winner_id} gets the new client`)
            db.query(`INSERT INTO has_client (employee_id,client_id) VALUES (${winner_id},${cid})`,(err)=>{
                if(err) {errorHandler(err,req,res,next);return next()};
                console.log("client added")
                db.query(`UPDATE employees SET client_count = client_count + 1 WHERE employee_id = ${winner_id}`,(err)=>{
                    if(err) {errorHandler(err,req,res,next);return next()};
                })
            })
        })
    })
}