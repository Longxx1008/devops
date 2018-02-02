/**
 * Created by 兰 on 2017-09-26.
 */
var utils = require('../../../common/core/utils/app_utils');





exports.getDetailMsgByNumber = function (service_id, cb) {

    var sql = "SELECT * from pass_project_method_info where  req_serial_num=201801301130001 and micro_service_id="+service_id;
    var orderBy = '';
    utils.pagingQuery4Eui_mysql(sql, orderBy, 0, 10, null, cb);

    };


exports.getServiceType = function (page, size, conditionMap, cb) {

        var sql = "SELECT distinct micro_service_id from pass_project_method_info where  req_serial_num=201801301130001";
        var conditions = [];
        var orderBy = '';
        utils.pagingQuery4Eui_mysql(sql, orderBy, page, size, conditions, cb);


    // return p;
};



//
// exports.getDetailMsgByNumber = function (service_id, cb) {
//     var p = new Promise(function(resolve,reject) {
//     var sql = "SELECT * from pass_project_method_info where  req_serial_num=201801301130001 and micro_service_id="+service_id;
//     var orderBy = '';
//         resolve(utils.pagingQuery4Eui_mysql(sql, orderBy, 0, 10, null, cb));
//     });
//     // return p;
//     };
//
//
// exports.getServiceType = function (page, size, conditionMap, cb) {
//     var p = new Promise(function(resolve,reject) {
//         var sql = "SELECT distinct micro_service_id from pass_project_method_info where  req_serial_num=201801301130001";
//         var conditions = [];
//         var orderBy = '';
//         resolve(utils.pagingQuery4Eui_mysql(sql, orderBy, page, size, conditions, cb));
//
//     });
//     // return p;
// };