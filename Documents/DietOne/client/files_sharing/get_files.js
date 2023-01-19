const db = require('./service/connect_db')
const {errorHandler} = require('../../utils/errorHandler');

exports.get_files = async(req,res,next) =>{
    var query = `SELECT * FROM wvh_posts WHERE ID IN (SELECT MAX(ID) FROM wvh_posts WHERE post_type = 'revision' AND post_parent IN (SELECT ID FROM wvh_posts WHERE post_type = 'post' AND post_status = 'publish') GROUP BY post_parent)`
    db.query(query,(err,results) => {

        if(err) {errorHandler(err,req,res,next); return next();}
        res.send(results)

    })
}