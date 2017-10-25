/**
 * Created by 兰 on 2017-10-24.
 */


var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');



//展示页大咖云集：标题查询
exports.getCarouselDetail = function (page, size, showType, cb) {
    var sql = "SELECT * from pass_develop_startPage_info where showType= "+'"'+showType+'"';

    var orderBy='';
    utils.pagingQuery4Eui_mysql(sql, orderBy, page, size, null, cb);
};




