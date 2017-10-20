// var ng = require("nodegrass");
// var Promise=require("bluebird");
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var config = require('../../../../config');
var Promise = require('bluebird');
var ng = require('nodegrass');
var mesos_add = '192.168.9.65';
var mesos_port = '5050';
var content_type = 'Content-Type: application/json';
// var async = require('async');
test().then(res => {
  console.log(res);
}).catch(eror => {

});

async function test() {
//   async.series({
//      one: getfromMarathon(),
//       two:update_one(),
//       three:update_two()
// }
//   ,function(error,rs){
//     if(error){
//         console.log(error);
//     }else{
//         console.log(rs);
//     }
//   })
  const step_one = await getfromMarathon();
  const step_two = await update_one();
  const step_three = await update_two();
  return '测试完成';
}

function getfromMarathon() {
  ng.get('http://192.168.9.61:8080/v2/groups', function(rs, status, headers) {
    var data = JSON.parse(rs);
    // console.log(data);
    var params = [];
    for (var i in data.apps) {
      var param = [];
      var app = data.apps[i];
      // console.log(app);
      param.push(app.id);
      param.push(app.container.docker.image);
      var container_id = '';
      param.push(0);
      param.push(0);
      param.push('');
      param.push(app.instances);
      var parent_service_id = '';
      param.push('');
      var url = '';
      var args = app.args;
      for (var j in args) {
        if (!(url) && args[j].indexOf('http') != -1) {
          url = args[j];
        }
      }
      param.push(url);
      var port = '';
      param.push(0);
      var service_type = '';
      param.push(app.user);
      var stop_user = '';
      params.push(param);
    }

    var groups = data.groups;
    var master_group_params = [];
    var slave_group_params = [];
    //加载parent
    for (var h in groups) {
      var group = groups[h];
      // console.log(group);
      var master_group_param = [];
      master_group_param.push(group.id);
      master_group_param.push(group.apps[0].container.docker.image);
      var container_id = '';
      master_group_param.push(1);
      master_group_param.push(0);
      master_group_param.push('');
      var instances = 0;
      for (var m in group.apps) {
        var app = group.apps[m];
        instances += app.instances;
      }
      master_group_param.push(instances);
      var parent_service_id = '';
      master_group_param.push('');
      var url = '';
      var args = group.apps[0].args;
      for (var j in args) {
        if (!(url) && args[j].indexOf('http') != -1) {
          url = args[j];
        }
      }
      master_group_param.push(url);
      var port = '';
      master_group_param.push(0);
      // var service_type="";
      master_group_param.push(group.apps[0].user);
      var stop_user = '';
      master_group_params.push(master_group_param);

      //填充slave

      var apps = group.apps;
      for (var n in apps) {
        var slave_group_param = [];
        var app = apps[n];
        // console.log(app);
        // var app= data.apps[i];
        // console.log(app);
        slave_group_param.push(app.id);
        slave_group_param.push(app.container.docker.image);
        var container_id = '';
        slave_group_param.push(0);
        slave_group_param.push(0);
        slave_group_param.push('');
        slave_group_param.push(app.instances);
        var parent_service_id = '';
        slave_group_param.push(group.id);
        var url = '';
        var args = app.args;
        for (var j in args) {
          if (!(url) && args[j].indexOf('http') != -1) {
            url = args[j];
          }
        }
        slave_group_param.push(url);
        var port = '';
        slave_group_param.push(0);
        var service_type = '';
        slave_group_param.push(app.user);
        var stop_user = '';
        slave_group_params.push(slave_group_param);
      }

    }
    // console.log("params ",params)
    // console.log("master_group_params",master_group_params);
    // console.log("slave_group_params",slave_group_params);
    Promise.all([
      insertToMysql(0, params, '一级'),
      insertToMysql(0, master_group_params, '二级'),
      insertToMysql(0, slave_group_params, '三级')]).then(function(res) {
      console.log(res);
    });
  }, null, 'utf8').on('error', function(e) {
    console.log('Got error: ' + e.message);
  });

}

function update_two() {
  //有效代码
  var sql = '(select * from pass_project_service_info where parent_service_tag <> \'\' )';
  mysqlPool.query(sql, function(e, res) {
    if (e) {
      console.log(e);
    } else {
      updateParent_info(0, res);
    }
  });
}

function update_one() {
  ng.get('http://192.168.9.61:8080/v2/tasks', function(rs, status, headers) {

    var data = JSON.parse(rs);
    var tasks = data.tasks;
    insertToMysqlMonitor(0, tasks);

    ng.get('http://192.168.9.65:5050/state.json',
        function(data_b, status, headers) {
          // console.log(status);
          // console.log(headers);
          var data_b = JSON.parse(data_b);
          var tasks_b = data_b.frameworks[0].tasks;
          // console.log(tasks);
          updateToInfo(0, tasks_b);
          insertUpdateDeploy(0, tasks, tasks_b);
          // for(var task in tasks_b){
          //     console.log(tasks_b[task]);
          // }

        }, null, 'utf8').on('error', function(e) {
      console.log('Got error: ' + e.message);
    });
  }, null, 'utf8').on('error', function(e) {
    console.log('Got error: ' + e.message);
  });

}

//更新deploy
function insertUpdateDeploy(k, tasks, tasks_b) {
  if (tasks.length > k && tasks) {
    var task = tasks[k];
    var name = task.appId;
    let sql = 'select * from pass_project_service_info where service_tag=?';
    mysqlPool.query(sql, [name], function(e, rs) {
      if (e) {
        console.log(e);
      } else {
        if (rs.length > 0) {
          let param = [];
          var service_id = rs[0].service_id;
          var deploy_tag = task.slaveId;
          var deploy_host_ip = task.host;
          var resource = '';
          for (var b in tasks_b) {
            var task_b = tasks_b[b];
            var name = task_b.name;
            if (name.indexOf('.') != -1) {
              name = `/${name.substring(name.indexOf('.') +
                  1)}/${name.substring(0, name.indexOf('.'))}`;
            }
            console.log(task_b);
            console.log('name   ', name);
            console.log('service_tag    ', rs[0].service_tag);
            if (name == rs[0].service_tag) {
              console.log('匹配到了 请注意！');

              resource = JSON.stringify(task_b.resources);
              // console.log(resource);
            }
          }
          param.push(service_id);
          param.push(deploy_tag);
          param.push(deploy_host_ip);
          console.log(resource);
          param.push(resource);
          let sql = 'select * from pass_project_service_deploy where service_id=? and deploy_host_tag=? ';

          mysqlPool.query(sql, [service_id, deploy_tag], function(errors, res) {
            if (errors) {
              console.log(errors);
            } else {
              if (res.length > 0) {
                let sql = 'update pass_project_service_deploy set deploy_host_tag=?,deploy_host_ip=?,resource=? where  service_id=?';
                mysqlPool.query(sql,
                    [deploy_tag, deploy_host_ip, resource, service_id],
                    function(es, r) {
                      if (es) {
                        console.log(es);
                      } else {
                        k++;
                        insertUpdateDeploy(k, tasks, tasks_b);
                      }
                    });

              } else {
                let sql = 'insert into pass_project_service_deploy (service_id,deploy_host_tag,deploy_host_ip,resource) values(?,?,?,?)';
                mysqlPool.query(sql, param, function(errors, results) {
                  if (errors) {
                    console.log(errors);
                  } else {
                    k++;
                    insertUpdateDeploy(k, tasks, tasks_b);
                  }
                });
              }
            }

          });

        } else {
          k++;
          insertUpdateDeploy(k, tasks, tasks_b);
        }
      }
    });
  } else {
    return;
  }
}

//有效代码 不需要修改
//更新parent_serice_id
function updateParent_info(k, res) {
  if (res.length > k && res) {
    var re = res[k];
    var service_id = re.service_id;
    var parent_service_tag = re.parent_service_tag;
    var sql_query = 'select * from pass_project_service_info where service_tag=?';
    mysqlPool.query(sql_query, parent_service_tag, function(e, rs) {
      if (e) {
        console.log(e);
      } else {
        if (rs.length > 0) {
          var parent_service_id = rs[0].service_id;
          var sql_update = 'update pass_project_service_info set parent_service_id=? where service_id=?';
          mysqlPool.query(sql_update, [parent_service_id, service_id],
              function(error, result) {
                if (error) {
                  console.log(error);
                } else {
                  k++;
                  updateParent_info(k, res);
                }
              });
        }
      }
    });
  } else {
    return;
  }
}

//更新container_id 到 info 或插入到 instance表
function updateToInfo(k, tasks) {

  if (tasks.length > k && tasks) {
    var task = tasks[k];
    let name = task.name;
    if (name.indexOf('.') != -1) {
      name = `/${name.substring(name.indexOf('.') + 1)}/${name.substring(0,
          name.indexOf('.'))}`;
      //  "/"+name.substring(name.indexOf(".")+1)+"/"+name.substring(0,name.indexOf("."))

      // name="/"+name;
      let sql = 'select * from pass_project_service_info where service_tag=? and parent_service_id != null';
      mysqlPool.query(sql, [name], function(e, rs) {
        if (e) {
          console.log(e);
        } else {
          if (rs.length > 0) {
            var slave_id = task.slave_id;
            var container_id = 'mesos-' + slave_id + '.' +
                task.statuses[0].container_status.container_id.value;
            var param = [];
            var status = task.statuses[0].state;
            param.push(container_id);
            param.push(status);
            param.push(rs[0].service_id);
            param.push('');
            var sql_select = 'select * from pass_project_service_instance where container_id=? and service_id=?';
            mysqlPool.query(sql_select, [container_id, rs[0].service_id],
                function(error, result) {
                  if (error) {
                    console.log(error);
                  } else {
                    if (result.length < 0) {
                      let sql = 'insert into pass_reoject_service_instance (service_id,container_id) values(?,?)';
                      mysqlPool.query(rs[0].service_id, sql, [container_id],
                          function(errors, results) {
                            if (error) {
                              console.log(error);
                            } else {
                              k++;
                              updateToInfo(k, tasks);
                            }
                          });
                    } else {
                      k++;
                      updateToInfo(k, tasks);
                    }
                  }
                });
          }
        }
      });
    } else {
      let sql = 'select * from pass_project_service_info where service_tag=? ';
      mysqlPool.query(sql, '/' + name, function(e, rs) {
        if (e) {
          console.log(e);
        } else {
          if (rs.length > 0) {
            console.log(task);
            var slave_id = task.slave_id;
            var container_id = 'mesos-' + slave_id + '.' +
                task.statuses[0].container_status.container_id.value;
            var param = [];
            var status = task.statuses[0].state;
            param.push(container_id);
            param.push(status);
            param.push(rs[0].service_id);
            param.push('');
            var sql_update = 'update pass_project_service_info set container_id=?,service_status=? where service_id=? and parent_service_id =?';
            mysqlPool.query(sql, param, function(error, result) {
              if (error) {
                console.log(error);
              } else {
                k++;
                updateToInfo(k, tasks);
              }
            });
          }
        }
      });
    }
  } else {
    return;
  }

}

function insertToMysqlMonitor(k, tasks) {
  if (tasks && tasks.length > k) {
    var task = tasks[k];
    // console.log(task)
    var sql = 'select * from pass_project_service_info where service_tag=?';
    mysqlPool.query(sql, task.appId, function(e, result) {
      if (e) {
        console.log(e);
      } else {
        if (result.length > 0) {
          var param = [];
          param.push(result[0].service_id);
          if (task.healthCheckResults) {
            param.push(task.healthCheckResults[0].alive);
            param.push('lastSuccess' + task.healthCheckResults[0].lastSuccess);
            var sql_insert = 'insert into pass_project_service_monitor  (service_id,service_status,service_remark) values(?,?,?)';
            mysqlPool.query(sql_insert, param, function(error, rs) {
              if (error) {
                console.log(error);
              } else {
                k++;
                insertToMysqlMonitor(k, tasks);
              }
            });
          }
        }
      }
    });

  } else {

    return;
  }

}

function insertToMysql(k, params, cm) {

  if (params && params.length > k) {
    // console.log(cm)
    var sql_query = 'select * from pass_project_service_info where service_tag=?';
    mysqlPool.query(sql_query, params[k][0], function(error, result) {
      if (error) {
        console.log(error);
      } else {
        if (result.length > 0) {
          var sql = 'update pass_project_service_info set service_tag=?,image_id=?,is_group=?,is_test=?,git_url=?,g' +
              'ross_instance_numbers=?,parent_service_tag=?,url=?,service_status=?,create_user=? where service_id=\'' +
              result[0].service_id + '\'';
          // console.log(excludeSpecial(sql),params[k].length)
          mysqlPool.query(sql, params[k], function(e, rs) {
            if (e) {
              console.log(e);
            } else {
              // console.log(rs);
              k++;
              insertToMysql(k, params, cm);
            }
          });

        } else {
          var sql = 'insert into pass_project_service_info (service_tag,image_id,is_group,is_test,git_url,g' +
              'ross_instance_numbers,parent_service_tag,url,service_status,create_user) values(?,?,?,?,?,?,?,?,?,?)';
          // console.log(sql,params[k].length)
          mysqlPool.query(sql, params[k], function(e, rs) {
            if (e) {
              console.log(e);
            } else {
              // console.log(rs);
              k++;
              insertToMysql(k, params, cm);
            }
          });

        }
      }
    });
  } else {
    return;
  }

}

// if(params&&params.length>k){
//     console.log(cm)
//     var sql_query="select * from pass_project_service_info where service_tag=?";
//     mysqlPool.query(sql_query,params[k][0],function(error,result){
//         if(error){
//             console.log(error);
//         }else{
//             if(result.length>0){
//                 var sql="update pass_project_service_info set service_tag=?,image_id=?,is_group=?,is_test=?,git_url=?,g" +
//                     "ross_instance_numbers=?,parent_service_tag=?,url=?,service_status=?,create_user=? where service_id='"+result[0].service_id+"'";
//                 console.log(excludeSpecial(sql),params[k].length)
//                 mysqlPool.query(sql,params[k],function(e,rs){
//                     if(e){
//                         console.log(e);
//                     }else{
//                         // console.log(rs);
//                         k++;
//                         insertToMysql(k,params);
//                     }
//                 })
//
//             }else{
//                 var sql="insert into pass_project_service_info (service_tag,image_id,is_group,is_test,git_url,g" +
//                     "ross_instance_numbers,parent_service_tag,url,service_status,create_user) values(?,?,?,?,?,?,?,?,?,?)"
//                 console.log(sql,params[k].length)
//                 mysqlPool.query(sql,params[k],function(e,rs){
//                     if(e){
//                         console.log(e);
//                     }else{
//                         // console.log(rs);
//                         k++;
//                         insertToMysql(k,params);
//                     }
//                 })
//
//             }
//         }
//     })
// }else{
//     return _res("结束");
// }

var excludeSpecial = function(s) {
  // 去掉转义字符
  // s = s.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
  // 去掉特殊字符
  s = s.replace(/[\@\#\$\%\^\&\*\{\}\:\"\L\<\>\?]/);
  return s;
};

function getInfo() {
  var data = [];
  var p = new Promise(function(resolve, reject) {
    ng.get('http' + '://' + mesos_add + ':' + mesos_port + '/master/state.json',
        function(res, status, headers) {
          if (res) {
            var results = JSON.parse(res);
            var slaves = results.slaves;
            var unreachable_tasks = results.frameworks[0].unreachable_tasks;
            var completed_tasks = results.frameworks[0].completed_tasks;
            var tasks = results.frameworks[0].tasks;
            // console.log("============================================>  ",results.frameworks[0].tasks);
            var k = 0;
            for (var i in tasks) {
              console.log(tasks[i]);

              var map = {};
              var slave_id = tasks[i].slave_id;
              var docker_container_id = 'mesos-' + tasks[i].slave_id + '.' +
                  tasks[i].framework_id;
              var containers = tasks[i].container;
              // console.log(containers.docker);
              map.image = containers.docker.image;
              map.containerName = tasks[i].name;
              map.containerId = docker_container_id;
              map.id = k;
              k++;
              for (var slave in slaves) {
                if (slaves[slave].id == slave_id) {
                  map.hostname = slaves[slave].hostname;
                }
              }
              data.push(map);
            }
            resolve({
              'data': data,
              'success': true,
              'message': '获取数据成功',
              'error': null,
              'code': '0000',
            });
          }
        },
        content_type,
        null,
        'utf8').on('error', function(e) {
      resolve({
        'data': null,
        'success': false,
        'message': '获取数据失败！',
        'error': e,
        'code': '1001',
      });

    });
  });
  return p;
}