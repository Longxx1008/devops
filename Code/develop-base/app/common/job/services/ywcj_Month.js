var mysql = require('mysql');
var config = require('../../../../config');
var $util = require('../../../common/util/util');
// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, config.mysql));
/**
 * 控制台打印字符串
 */
exports.PrintMonth = function () {

    console.log("执行业务酬金环比任务");

};

pool.getConnection(function (err, connection) {
    if (err != null) {
        console.log(err.message);
    } else {

        var sql = 'call zgz_insert_ywcj_channel_area_month("ywcj_channel_area_money");';

        console.log("======sql======" + sql);
        connection.query(sql, function (err, result) {
            console.log(err+":"+result);
            connection.release();
        });
    }
});



