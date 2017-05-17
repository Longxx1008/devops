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
    var sql = "SELECT t.*" ;
    var conditions = [];
    if(conditionMap) {
        if(conditionMap.flag && conditionMap.flag == 'favorites'){
            sql += ",t2.imagetype ,t2.userCode from pass_develop_image_info t "+
                "LEFT JOIN pass_develop_image_mapping t2 ON t.imageCode=t2.imageCode where t2.imagetype = 1 ";
        }else if(conditionMap.flag && conditionMap.flag == 'myimage'){
            sql += ",t2.imagetype ,t2.userCode from pass_develop_image_info t "+
                "LEFT JOIN pass_develop_image_mapping t2 ON t.imageCode=t2.imageCode where t2.userCode = '"+conditionMap.loginUser+"' ";
        }else{
            sql += ",t2.imagetype ,t2.userCode from pass_develop_image_info t "+
                "LEFT JOIN pass_develop_image_mapping t2 ON t.imageCode=t2.imageCode and t2.imagetype = '1' where 1=1 " ;
        }
        if(conditionMap.type){
            sql += " and t.catagory = '"+conditionMap.type+"' ";
        }
    }

    var orderBy = " order by t.collectionNumber desc ";
    console.log("查询用户信息sql ====",sql);
    utils.pagingQuery4Eui_mysql(sql,orderBy, page, size, conditions, cb);
};

/**
 * 创建项目信息
 * @param data
 * @param cb
 */
exports.add = function(data,data_map,cb) {
    var sql = "insert into pass_develop_image_info(imageResource,imageName,channels,pictureName,pictureType,picture,simpleIntroduction,catagory) values(?,?,?,?,?,?,?,?)";
    var sql_map="insert into pass_develop_image_mapping(userCode,imageCode) values(?,?)"
    mysqlPool.query(sql,data,function(err,results) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '新增镜像异常', null, err));
        } else {
            console.info(results.insertId);
            data_map.push(results.insertId);
            console.info(data_map);
            mysqlPool.query(sql_map,data_map,function(error,results){
                if(error){
                    cb(utils.returnMsg(false, '1000', '新增镜像异常', null, error));
                } else{
                    cb(utils.returnMsg(true, '0000', '新增镜像成功', null, null));
                }
            });

        }
    });
};

/**
 * 修改收藏数或下载数
 * @param conditionMap
 * @param data
 * @param mapData
 * @param cb
 */
exports.imageCollectOrDownload = function(conditionMap,data,mapData,cb){
    var sql = "update pass_develop_image_info set ";
    var mapsql = "update pass_develop_image_mapping set imagetype =? where imageCode =? and userCode =?";
    if(conditionMap && conditionMap.downloadNum){//记录下载数
        sql += "downloadNumber =?"
    }else{//收藏数
        sql += "collectionNumber =?"
    }
    sql += " where imageCode =? ";
    mysqlPool.query(sql,data,function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '修改记录数异常', null, err));
        } else {
            if(!conditionMap.length>0){
                mysqlPool.query(mapsql,mapData,function(error,mapresult){
                    if(error){
                        cb(utils.returnMsg(false, '1000', '修改类型异常', null, error));
                    } else{
                        cb(utils.returnMsg(true, '0000', '修改类型成功', mapresult, null));
                    }
                });
            }else{
                cb(utils.returnMsg(true, '0000', '修改记录数成功', result, null));
            }


        }
    });
}

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