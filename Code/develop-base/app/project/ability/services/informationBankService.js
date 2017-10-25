/**
 * Created by 兰 on 2017-09-26.
 */
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');



/**
 * 获取项目的分页数据
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.pageList = function (page, size, conditionMap, cb) {
    var sql = "SELECT id,information_title,information_issuer_id,information_issuer,information_create_time,information_view_count,information_type,information_picture_name,information_link,information_introduce,information_picture_type,information_picture from pass_develop_information_info ";

    var orderBy = " order by information_view_count desc ";
    var conditions = [];
    utils.pagingQuery4Eui_mysql(sql, orderBy, page, size, conditions, cb);
};


// //查询文章总条数
// exports.searchAllCount = function ( cb) {
//     var sql = "SELECT Count(1) as allCount from pass_develop_information_info ";
//     mysqlPool.query(sql,function(err,result) {
//         if(err) {
//             cb({'rows':{},'total': 0});
//         } else {
//             cb({'rows':result});
//         }
//     });
// };


//  标题/发布人/类型查询
exports.pageListSearch = function (page, size, conditionMap, cb) {
    var sql = "SELECT id,information_title,information_issuer_id,information_issuer,information_create_time,information_view_count,information_type,information_picture_name,information_link,information_introduce,information_picture_type,information_picture from pass_develop_information_info ";
    var conditions = [];
    var orderBy = " order by information_view_count desc ";
    if (conditionMap) {

        if (conditionMap.information_title) {
            sql += "where information_title like" + " \"" + "%" + conditionMap.information_title + "%" + "\"" + " or information_issuer like" + " \"" + "%" + conditionMap.information_title + "%" + "\"";
            if (conditionMap.information_type) {
                sql += " or information_type = " + " \"" + conditionMap.information_type + "\"";
            }
        } else if (conditionMap.information_type) {
            sql += " where information_type = " + " \'" + conditionMap.information_type + "\'";
        }

    }

    utils.pagingQuery4Eui_mysql(sql, orderBy, page, size, conditions, cb);
};

//首页查询
exports.pageListDemo = function (page, size, conditionMap, cb) {
    var sql = "SELECT * from pass_develop_information_info ";

    var orderBy = " order by information_view_count desc ";

    utils.pagingQuery4Eui_mysql(sql, orderBy, page, size, null, cb);
};





exports.getDetailMsgById = function (page, size, conditionMap, cb) {
    var sql = "SELECT id,information_title,information_issuer,information_create_time,information_view_count,information_content from pass_develop_information_info ";
    var conditions = [];
    var orderBy = " order by information_view_count desc ";
    if (conditionMap) {
        if (conditionMap.id) {
            sql += "where id = " + conditionMap.id;
        }
    }
    utils.pagingQuery4Eui_mysql(sql, orderBy, page, size, conditions, cb);
};


exports.addCount = function(id,cb) {
    var sql="UPDATE pass_develop_information_info SET information_view_count=information_view_count+1 where id="+id;
    mysqlPool.query(sql,null,function(err,result) {
        if(err) {
            console.log("更新浏览量失败");
        } else {
            cb({'rows':result});
        }
    });
};