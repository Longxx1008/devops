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


// //获取Json 数据
function getdata() {
    var url = "http://"+config.platform.dockerIp+":"+config.platform.dockerPort+"/v2/_catalog";
    console.log("url     :" + url);
    http.get(url, function (req, res) {
        var jsonStr = '';
        req.on("data", function (data) {
            jsonStr = data;
        });
        req.on("end", function () {
            catagoryJson = JSON.parse(jsonStr);
            catagorys = catagoryJson.repositories;
            getVersion(catagorys, insertDataBase, insertMapData);
        });
    });
}

//获取Version数据
function getVersion(catagorys, callback,insertMapData) {
    var url = "http://"+config.platform.dockerIp+":"+config.platform.dockerPort+"/v2/";
    for (var i = 0; i < catagorys.length; i++) {
        var temp_string = new String(url);
        temp_string+= catagorys[i] + "/tags/list";
        console.log(temp_string);
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
function updateMapping(result){
    console.log("result     ")
    console.info(result)
    var sql="select a.gitlabProjectId,c.imageCode,a.projectCode,a.projectName,b.projectId,b.userId  from pass_develop_project_resources a	" +
        "	left join pass_develop_project_members b on a.gitlabProjectId=b.projectId  " +
        "	left join pass_develop_image_info c on a.projectCode=c.imageName  " +
        "  where a.gitlabProjectId is not null and a.gitlabProjectId <> 0 and a.projectCode=";
    for(var i=0;i<result.length;i++){
        var data=JSON.parse(JSON.stringify(result[i]))
        console.info(data.imageName);
        var imageName =data.imageName;
        if(imageName.lastIndexOf('/')!=-1){
            imageName=imageName.substr(imageName.lastIndexOf('/')+1,-1)
            console.log("")
        }else{
            sql+="'"+data.imageName+"'";
            console.log("89     :  "+sql);
            pool.query(sql,[],function(errs,results){
                if(errs){
                    console.info(errs)
                }else{
                    if(results.length>0){
                        var sqlMapping="select * from pass_develop_image_mapping where imageCode="
                        var arr=new Array();
                        var arrMap=new Array();
                        var mapTemp={};
                        var imageCode=new String(JSON.parse(JSON.stringify(results[0])).imageCode);
                        console.log("101   :   "+  imageCode)
                        for( var k=0;k<results.length;k++){
                            var temp=JSON.parse(JSON.stringify(results[k])).imageCode
                            arr.push(temp.userId);
                            mapTemp[temp.userId]=temp.userId;
                        }
                        if(imageCode!=null){
                            sqlMapping=sqlMapping+imageCode;
                            console.log("109      :  "+sqlMapping);
                            pool.query(sqlMapping,[],function(error,ret){
                                if(error){
                                    console.log(error);
                                }else{
                                    if(ret.length>0){
                                        for(var j=0;j<ret.length;j++){
                                            var tempMap=JSON.parse(JSON.stringify(ret[j]));
                                            arrMap.push(tempMap.userCode);
                                        }
                                    }
                                }

                            });
                        }

                        if(arr.length !=arrMap.length){
                            for(var a=0;a<arr.length;a++){

                                for(var b=0;b<arrMap.length;b++){
                                    if(arr[a]==arrMap[b]){
                                        delete mapTemp[arr[a]];
                                    }
                                }
                                if(mapTemp.length>0){
                                    for (var key in mapTemp){
                                        var insert="insert into pass_develop_image_mapping (imageCode,userCode) " +
                                            "values("+imageCode+" , "+key+")";
                                        console.info("137    :   "+insert);
                                        pool.query(insert,[],function(errors,results){
                                            if(errors){
                                                console.log(errors);
                                            }else{
                                                console.log("更新了一个Mapping");
                                            }
                                        });
                                    }

                                }
                            }
                        }
                    }
                }
            });

        }

    }

}

function updateVersion(result,dataVersion){
    if(result.length>0&&dataVersion.length>0){
        //初步检验
        for(var i=0;i<result.length;i++){
            var data=JSON.parse(JSON.stringify(result[i]))
            var imageCode=data.imageCode;
            var sql="select * from pass_develop_image_version where imagecode="+imageCode;
            console.log("172    :  "+sql);
            pool.query(sql,[],function(err,result){
               if(err){
                   console.log(err)
               }else{
                   if(result.length>0){
                       var arr=new Array();

                       var gitMap={};
                       for(var k=0;k<result.length;k++){
                           var dataVer=JSON.parse(JSON.stringify(result[k]));
                            arr.push(dataVer.imageVersion);
                       }

                       for(var t=0;t<dataVersion.length;t++){
                           gitMap[dataVersion[t]]=dataVersion[t];
                       }
                       if(dataVersion.length!=arr.length){
                           for(var a=0;a<dataVersion.length;a++){
                                for(var b=0;b<arr.length;b++){
                                    if(arr[b]==dataVersion[a]){
                                        delete gitMap[dataVersion[a]]
                                    }
                                }

                           }
                           if(gitMap.length>0){
                               for (var key in gitMap){
                                   var sqlInsert="insert into pass_develop_image_version (imageCode,imageVersion) " +
                                       "values("+imageCode+" , "+"'"+key+"') ";
                                   console.log("  202   sqlInsert    :"+sqlInsert);
                                   pool.query(sqlInsert,[],function(err,results){
                                       if(err){
                                           console.log(err);
                                       }else{
                                           console.log("更新一个Version");
                                       }
                                   });
                               }
                           }
                       }
                   }
               }
            });
        }


    }
}
//插入数据;
function insertDataBase(version_data, insertMapData) {
        for (var i= 0; i < version_data.length; i++) {
            var imageName = version_data[i].name;
            var tags = version_data[i].tags;          
            var temp_sql = "select imageCode ,imageName from pass_develop_image_info where imageName='" + imageName + "'";
            console.log("执行一次插入");
            pool.query(temp_sql,[], function (err,result) {
                if (err) {
                    console.log(err);

                } else {
                    if (result.length>0) {
                        //当info表格中存在的时候相关项目名的时候 就开始验证 Version  ,mapping表中的数据否为最新的
                        console.log("已经存在,检查最新的表格内容");
                        updateMapping(result);
                        updateVersion(result,version_data);
                    } else {
                        var sql_temp_info = new String(sql_info);
                        sql_temp_info += "'" + imageName + "')";
                        pool.query(sql_temp_info,[], function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {                                                                       
                                var imageCode = result.insertId;
                                for (var j = 0; j < tags.length; j++) {
                                    var version_temp = tags[j];
                                    var sql_temp_version = new String(sql_version);
                                    sql_temp_version +=  imageCode + ",'" + version_temp + "')";
                                    pool.query(sql_temp_version,[], function (err,ret) {
                                        if (err) {
                                            return console.log(err);
                                        }else{
                                            // console.log(ret);
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
}

function insertMapData(version_data ,imageCode) {
        for (var i = 0; i < version_data.length; i++) {
            var sql = new String('SELECT t.gitlabProjectId from pass_develop_project_resources t where t.gitlabProjectId is not null and t.gitlabProjectId <> 0 and  t.projectCode= ');
            var sql_member = new String("select * from pass_develop_project_members where projectId=");
            var sql_map = new String("insert into pass_develop_image_mapping (imageCode,userCode) values(");
            var imageName = version_data[i].name
            if (imageName.lastIndexOf != -1) {
               imageName= imageName.substring(imageName.lastIndexOf("/")+1);
            }
            sql += "'"+imageName+"'";
            console.log(sql);
            pool.query(sql,[], function (err, result) {
                if (err) {
                    console.log(err);
                } else {
                    if (result.length > 0) {
                        var GroupID = JSON.parse(JSON.stringify(result[0])).gitlabProjectId;
                        sql_member += GroupID;
                        conn.query(sql_member, function (err,ret) {
                            if (err) {
                                console.log(err);
                            } else {
                                // console.log(ret);
                                for (var k = 0; k < ret.length; k++) {
                                    var userCode = new String(JSON.parse(JSON.stringify(ret[k])).userId);
                                    sql_temp_map = new String(sql_map);
                                    sql_temp_map += imageCode + ",'" + userCode + "')";
                                    pool.query(sql_temp_map,[], function (error, result) {
                                        if (error) {
                                            console.log(error);
                                        } else {
                                            // console.log(result);
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
}

