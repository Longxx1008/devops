var mysql = require('mysql');
var config = require('../../../../config');
var db    = {};
var pool  = mysql.createPool(config.mysql);
db.query = function(sql, params, cb){
    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log(err);
            cb(err, null);
            return;
        };
        cb(null, result ? JSON.parse(JSON.stringify(result)) : null);
    });
}
module.exports = db;