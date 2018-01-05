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
    var sql = "SELECT distinct t.*,DATE_FORMAT(date_add(t.createDate, interval 8 hour),'%Y-%m-%d %H:%i:%s') as imageTime " ;
    var conditions = [];
    if(conditionMap) {
        if(conditionMap.flag && conditionMap.flag == 'favorites'){
            sql += ",t2.imagetype ,t2.userCode from pass_develop_image_info t "+
                "LEFT JOIN pass_develop_image_mapping t2 ON t.imageCode=t2.imageCode where t2.imagetype = 1 and t2.userCode = '"+conditionMap.loginUser+"'  ";
        }else if(conditionMap.flag && conditionMap.flag == 'myimage'){
            sql += " from pass_develop_image_info t "+
                " where t.updateBy = '"+conditionMap.loginUser+"' ";
        }else{
            sql += ",t2.imagetype ,t3.imagePoint from pass_develop_image_info t "+
                "LEFT JOIN pass_develop_image_mapping t2 ON t.imageCode=t2.imageCode and t2.userCode = '"+conditionMap.loginUser+"' " ;
            sql += " LEFT JOIN pass_develop_image_pointmapping t3 ON t.imageCode=t3.imageCode and t3.userCode = '"+conditionMap.loginUser+"'"+"where 1=1";
            //sql += ",t2.imagetype ,t2.userCode, t3.imagePoint from pass_develop_image_info t "+
            //    "LEFT JOIN pass_develop_image_mapping t2 ON t.imageCode=t2.imageCode and t2.imagetype = '1'" ;
            //sql += " LEFT JOIN pass_develop_image_pointmapping t3 ON t.imageCode=t3.imageCode where 1=1";
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
exports.imageCollectOrDownload = function(conditionMap,data,mapData,flag,cb){
    var sql = "update pass_develop_image_info set ";
    var mapsql = "";
    var insertmapsql="";
    console.log("",mapData.imagetype);
    if(flag==0){
        console.log("点赞部分sql");
        console.log(mapData.imagePoint);
        sql += "pointNumber =?";
        mapsql = "update pass_develop_image_pointmapping set imagePoint =? where imageCode =? and userCode =?";
        insertmapsql="insert into pass_develop_image_pointmapping(imagePoint,imageCode,userCode) values(?,?,?)";
    }else if(flag==1){
        console.log("收藏部分sql");
        sql += "collectionNumber =?";
        mapsql = "update pass_develop_image_mapping set imagetype =? where imageCode =? and userCode =?";
        insertmapsql="insert into pass_develop_image_mapping(imagetype,imageCode,userCode) values(?,?,?)";
    }
    //if(conditionMap && conditionMap.downloadNum){//记录下载数
    //    sql += "downloadNumber =?";
    //}else{//收藏数
    //    // sql += "collectionNumber =?";
    //}
    sql += " where imageCode =? ";
    mysqlPool.query(sql,data,function(err,result) {
        if(err) {
            cb(utils.returnMsg(false, '1000', '修改记录数异常', null, err));
        } else {
            if(conditionMap && conditionMap.downloadNum){
                cb(utils.returnMsg(true, '0000', '修改记录数成功', result, null));
            }else{

                console.log("mapsss",mapData);
                mysqlPool.query(mapsql,mapData,function(error,mapresult){
                    if(error){
                        cb(utils.returnMsg(false, '1000', '修改类型异常', null, error));
                    } else{
                        console.log("更新映射表",mapresult);

                        if(mapresult.changedRows){
                            cb(utils.returnMsg(true, '0000', '修改类型成功', mapresult, null));
                            console.log("更新成功");
                        }
                        else{
                            console.log("镜像无数据实行插入");
                            mysqlPool.query(insertmapsql,mapData,function(error,insertmapresult){
                                if(error){
                                    cb(utils.returnMsg(false, '1000', '修改类型异常', null, error));
                                } else{
                                    cb(utils.returnMsg(true, '0000', '修改类型成功', insertmapresult, null));
                                    console.log("插入映射表成功");
                                }
                            });
                        }
                    }
                });

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