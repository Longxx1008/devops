/**
 * Created by aurora on 2017/5/8.
 * 获取镜像名称和版本号
 */

var mysql = require('mysql');
var fs = require("fs");
var http=require('http');
var config = require('../../../../config');
var $util = require('../../../common/util/util');
var DateUtils = require('../../../common/core/utils/DateUtils');
// 使用连接池，提升性能
var pool = mysql.createPool($util.extend({}, config.mysql));
/**
 * 控制台打印字符串
 */
var catagorys = '';
var catagoryJson = '';
var version_data = [];
var versionJson = '';
var sql_info = "insert into pass_develop_image_info(imageName) values(";
var sql_version = "insert into pass_develop_image_version(imageCode,imageVersion) values(";
//启动

exports.queryImageVersionJobRun = function(){
    console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 获取镜像与相关镜像版本数据任务开始');
    getdata();
    console.log(DateUtils.format(new Date(),'yyyy-MM-dd hh:mm:ss') + ' 获取镜像与相关镜像版本数据任务结束');
};


//获取Json 数据
function getdata() {
    http.get("http://10.201.253.197:5000/v2/_catalog", function (req, res) {
        var jsonStr = '';
        req.on("data", function (data) {
            jsonStr = data;
        });
        req.on("end", function () {
            catagoryJson = JSON.parse(jsonStr);
            catagorys = catagoryJson.repositories;
            console.log(catagorys);
            console.log(catagorys.length);
            getVersion(catagorys, insertDataBase, insertMapData);
        });
    });
}

//获取Version数据
function getVersion(catagorys, callback,insertMapData) {

    var url = 'http://10.201.253.197:5000/v2/';
    for (var i = 0; i < catagorys.length; i++) {
        var temp_string = new String(url);
        temp_string+= catagorys[i] + "/tags/list";
        http.get(temp_string, function (req, res) {
            var versionStr = '';
            req.on("data", function (data) {
                versionStr += data;
            });

            req.on("end", function () {
             version_data=[JSON.parse(versionStr)];
             callback(version_data, insertMapData);
            });
        });
    }
    
   
}

//插入数据;
function insertDataBase(version_data, insertMapData) {
    pool.getConnection(function (err, conn) {
        for (var i= 0; i < version_data.length; i++) {
            var imageName = version_data[i].name;
            var tags = version_data[i].tags;          
            var temp_sql = "select imageName from pass_develop_image_info where imageName='" + imageName + "'";
            console.log("执行一次插入");
            conn.query(temp_sql, function (err,result) {
                if (err) {
                    console.log(err);
                    return '';
                } else {
                    if (result.length) {
                        return console.log("已经存在无需更新");
                    } else {
                        var sql_temp_info = new String(sql_info);
                        sql_temp_info += "'" + imageName + "')";
                        conn.query(sql_temp_info, function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {                                                                       
                                var imageCode = result.insertId;
                                console.log(result.insertId);
                         
                                for (var j = 0; j < tags.length; j++) {
                                    var version_temp = tags[j];
                                    var sql_temp_version = new String(sql_version);
                                    sql_temp_version +=  imageCode + ",'" + version_temp + "')";
                                    console.log(sql_temp_version);
                                    conn.query(sql_temp_version, function (err,ret) {
                                        if (err) {
                                            return console.log(err);
                                        }else{
                                            console.log(ret);
                                        }
                                    });
                                }

                                // 插入到MAP 表格
                              insertMapData(version_data, imageCode);
                            }
                        });
                    }
                }
            });
        }
        conn.release();

    });
}

function insertMapData(version_data ,imageCode) {
    pool.getConnection(function (err, conn) {
        for (var i = 0; i < version_data.length; i++) {
            var sql = new String('SELECT t.gitlabProjectId from pass_develop_project_resources t where t.projectCode= ');
            var sql_member = new String("select * from pass_develop_project_members where projectId=");
            var sql_map = new String("insert into pass_develop_image_mapping (imageCode,userCode) values(");
            var imageName = version_data[i].name
            if (imageName.lastIndexOf != -1) {
               imageName= imageName.substring(imageName.lastIndexOf("/")+1);
            }
            sql += "'"+imageName+"'";
            console.log(sql);
            conn.query(sql, function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    if (result.length > 0) {
                        var GroupID = JSON.parse(JSON.stringify(result[0])).gitlabProjectId;
                        console.log(GroupID);
                        sql_member += GroupID;
                        conn.query(sql_member, function (err,ret) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(ret);
                                for (var k = 0; k < ret.length; k++) {
                                    var userCode = new String(JSON.parse(JSON.stringify(ret[k])).userId);
                                    sql_temp_map = new String(sql_map);
                                    sql_temp_map += imageCode + ",'" + userCode + "')";
                                    conn.query(sql_temp_map, function (error, result) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            console.log(result);
                                        }

                                    });

                                }
                               
                            }
                        });
                        

                    } else {
                        console.error("查询不到数据");
                    }

                }
            });


        }
        conn.release();
    });
    
}