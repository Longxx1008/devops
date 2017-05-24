var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');

/**
 * 获取项目的分页数据
 * @param page
 * @param size
 * @param conditionMap
 * @param cb
 */
exports.pageList = function(page, size, conditionMap, cb) {
    var sql = " SELECT t.*,DATE_FORMAT(date_add(t.createDate, interval 8 hour),'%Y-%m-%d %H:%i:%s') as imageTime from pass_develop_image_info t where 1=1";
    var conditions = [];
    var orderBy = " order by t.imageCode ";
    console.log("查询用户信息sql ====",sql);
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, conditions, cb);
};

//获取镜像版本数据
exports.versionList = function(conditionMap, cb) {
    var sql = " select t.* from pass_develop_image_version t where 1=1 ";
    var condition = [];
    if(conditionMap) {
        if(conditionMap.imageCode) {
            sql += " and t.imageCode=?";
            condition.push(conditionMap.imageCode);
        }
    }
    sql += " order by t.imageCode desc";
    // 查询数据库默认版本数据
    mysqlPool.query(sql,condition,function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '获取版本信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '获取版本信息成功', results, null));
        }
    });
}

/**
 * 创建项目信息
 * @param data
 * @param cb
 */
exports.add = function(data,data_map,cb) {
    var sql = "insert into pass_develop_image_info(imageResource,imageName,channels,pictureName,pictureType,picture,simpleIntroduction,catagory) values(?,?,?,?,?,?,?,?)";
    var sql_map="insert into pass_develop_image_mapping(userCode,imageCode) values(?,?)"
    var sql_version="insert into pass_develop_image_version(imageCode,imageVersion) values(?,'V 1.0.0')"
    var data_version=[];
    mysqlPool.query(sql,data,function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '新增镜像异常', null, err));
        } else {
            data_map.push(results.insertId);
            mysqlPool.query(sql_map,data_map,function(error,results_ONE){
                if(error){
                    cb(utils.returnMsg(false, '1000', '新增镜像异常', null, error));
                } else{
                    data_version.push(results.insertId);
                    mysqlPool.query(sql_version,data_version,function(errors,results_two){
                        if(errors){
                            cb(utils.returnMsg(false, '1000', '新增镜像异常', null, errors));
                        }else{
                            cb(utils.returnMsg(true, '0000', '新增镜像成功', null, null));
                        }
                    });
                }
            });

        }
    });
};

/**
 * 更新项目信息
 * @param data
 * @param cb
 */
exports.update = function(sql,data, cb) {
    mysqlPool.query(sql, data, function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '更新项目信息异常', null, err));
        } else {
            cb(utils.returnMsg(true, '0000', '更新项目信息成功', null, null));
        }
    });
};

/**
 * 删除项目信息
 * @param id
 * @param cb
 */
exports.delete = function(id, cb) {
    console.log('--------------------------------------------------------');
    console.log(id);
    var sql_info= "delete from pass_develop_image_info where imageCode = ?";
    var sql_version="delete from pass_develop_image_version where imageCode = ?"
    var sql_map="delete from pass_develop_image_mapping where imageCode= ? "
    mysqlPool.query(sql_info,[id],function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '删除项目信息异常_info', null, err));
        } else {
            mysqlPool.query(sql_version,[id],function(err,results){
                if(err) {
                    cb(utils.returnMsg(false, '1000', '删除项目信息异常_version', null, err));
                } else {
                    mysqlPool.query(sql_map,[id],function(err,results){
                        if(err) {
                            cb(utils.returnMsg(false, '1000', '删除项目信息异常_map', null, err));
                        } else {
                            cb(utils.returnMsg(true, '0000', '删除项目信息成功', null, null));
                        }
                    });
                }
            });
        }
    });
};