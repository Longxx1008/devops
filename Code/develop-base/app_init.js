var deployedInfoSyncJob = require('./app/common/job/services/deployedInfoSyncJob');
var projectService = require('./app/project/dpm/services/projectService');
var colonyManageService = require('./app/project/operation/services/colonyManageService');
/**
 * 系统启动时加载的内容
 * @param app
 */
exports.$ = function() {
    //启动健康检查定时任务
    // setInterval(function(){
    //     deployedInfoSyncJob.doJob();
    //     projectService.refreshMarathonLbInfo();
    //     colonyManageService.syncColonyInfo();
    // },10000);
}