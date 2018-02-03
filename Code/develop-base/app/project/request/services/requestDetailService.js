/**
 * Created by 兰 on 2017-09-26.
 */
var utils = require('../../../common/core/utils/app_utils');





exports.getDetailMsgByNumber = function (service_id, serial_number,cb) {

    var sql = "SELECT * from pass_project_method_info where  req_serial_num=" + serial_number+" and micro_service_id=" + service_id;
    var orderBy = '';
    utils.pagingQuery4Eui_mysql(sql, orderBy, 0, 10, null, cb);

};


exports.getServiceType = function (page, size, conditionMap, cb) {

    var sql= "select micro_service_id  from pass_project_method_info  where  req_serial_num=" + conditionMap.serial_number + " group by micro_service_id  order by max(id) asc";
    var conditions = [];
    var orderBy = '';
    utils.pagingQuery4Eui_mysql(sql, orderBy, page, size, conditions, cb);


};


