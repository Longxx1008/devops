'use strict';
/**
 * Created by hedingxin on 2018/2/2
 */
var mysqlPool = require('../../utils/mysql_pool');

module.exports= {
  async getAllAppWithApi(){
   return await mysqlPool.queryPromise('select p.gitlabProjectId,p.id,p.projectCode,p.projectName,d.gray_version,d.blue_version,d.formal_version from pass_develop_project_resources_copy2 p left join (select formal_version,gray_version,blue_version,projectName from pass_develop_project_deploy_copy2 where formal_version is not null) d on d.projectName=p.projectName where 1=1')

  },//获取应用
  async createNewApi(){},//创建新的api
  async trafficBreaking(){},//流量阻断
};
