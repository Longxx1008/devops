var express = require('express');
var router = express.Router();

var payload = require("request-payload");
var mysqlAdapter = require("../utils/MySqlAdapter");
var msSqlAdapter = require("../utils/MsSqlAdapter");
var FirebirdAdapter = require("../utils/FirebirdAdapter");
var PostgreSQLAdapter = require("../utils/PostgreSQLAdapter");

var dictService = require('../../syscfg/services/dict_service');
var memcached_utils = require('../../core/utils/memcached_utils');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/', function(req, res, next) {
  //var vPayload = JSON.parse(req.body);
  console.log("dbpath:");
  //console.log(req.query.dbpath);
  var dbPath = req.query.dbpath;//保存字典名称
  var dbString ="";

/*  console.log(req.params);
  console.log(req.query);
  console.log(req.body);*/

  //var body = req.body;
  var body = JSON.stringify(req.body);

  // payload(req,function (body) {
    /*  if(body.connectionString=="123456"){
     body.connectionString="Server=10.201.250.143; Database=jkyth; uid=root; password=yanfashi2016;";
     }*/
    console.log('test');
    memcached_utils.getDict(function (m, g) {
      console.log("memcached detail:");
      var dicDb = g.common_db_connect_info;
      if(dicDb==null||dicDb.length==0){
        alert("获取数据库连接参数失败");
        return;
      }
      for(var i =0;i<dicDb.length;i++){
        var dic = dicDb[i];
        var tempText = dic.text;
        if(tempText == dbPath){
          dbString = dic.id;
          break;
        }
      }
      //dbString = "Server=10.201.250.143; Database=jkyth; uid=root; password=yanfashi2016;";
      console.log("dbPath:"+dbPath+",dbString:"+dbString);
      //console.log("body--------type--------------");
      //console.log(typeof body);
      var tempDbName = "";
      var arrDb = dbString.split(";");
      if(arrDb.length<2){
        alert("数据库连接字符串格式有误，打开失败");
        return;
      }
      var tempDbString = arrDb[1];
      if(tempDbString.length<11){
        alert("数据库连接字符串格式有误，打开失败");
        return;
      }
      tempDbName = tempDbString.slice(10,tempDbString.length);
      //console.log("tempDbName:"+tempDbName);
      //body = body.replace("123456","Server=10.201.250.143; Database=jkyth; uid=root; password=yanfashi2016;");
      body = body.replace(dbPath,dbString);
      body = body.replace("''","'"+tempDbName+"'");
      //console.log("body--------begin--------------");
      //console.log(body);
      //console.log("body--------end--------------");

      var commond = JSON.parse(body);
      //console.log('dbtype:'+commond.database);
      //console.log("commond:");
      //console.log(commond);
      /*  if(commond.connectionString=="database"){
       commond.connectionString="Server=10.201.250.143; Database=jkyth; uid=root; password=yanfashi2016;";
       }*/
      if(commond.database == 'MS SQL'){
        msSqlAdapter.process(commond,function (result){
          // console.log(result);

          res.send(result);
          console.log('end');
        } );
      }
      else if(commond.database == 'MySQL'){
        mysqlAdapter.process(commond,function (result){
          res.send(result);
          console.log('end');
        } );
      }
      else if(commond.database == 'Firebird'){
        FirebirdAdapter.process(commond,function (result){
          // console.log(result);

          res.send(result);

          console.log('end');
        } );
      }else if(commond.database == 'PostgreSQL'){
        PostgreSQLAdapter.process(commond,function (result){
          // console.log(result);

          res.send(result);
        } );
      }

      console.log("shuchu body");
      console.log(body);

    });



  //});

  //res.send('respond with a resource');
});

module.exports = router;
