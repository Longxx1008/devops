/**
 * Created by liping on 2017-4-1.
 * 全省单渠道酬金表数据统计定时任务
 */
var mysql = require('mysql');
var config = require('../../../../config');
var $util = require('../../../common/util/util');
var DateUtils = require('../../../common/core/utils/DateUtils');
// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, config.mysql));

exports.channelMoneyJobRun = function(){
    console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 全省单渠道酬金表数据统计任务开始');
    var now = DateUtils.now();
    //统计上月数据
    var lastMonthDateObj = DateUtils.dateAdd(now,-1,'M');
    //yyyyMM格式字符串
    var month = DateUtils.format(lastMonthDateObj,'yyyyMM');
    //调用存储过程
    pool.getConnection(function (err, connection) {
        if (err != null) {
            console.log(err.message);
        } else {

            var sql = "call p_ywcj_channel_money('"+ month + "');";

            console.log("======sql======" + sql);
            connection.query(sql, function (err, result) {
                console.log(err+":"+result);
                connection.release();
                console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 全省单渠道酬金表数据统计任务结束');
            });
        }
    });
};
