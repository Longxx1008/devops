var deployedInfoSyncJob = require('./app/common/job/services/deployedInfoSyncJob');
var projectService = require('./app/project/dpm/services/projectService');
/**
 * 系统启动时加载的内容
 * @param app
 */
exports.$ = function(app) {
    //启动健康检查定时任务
    /*setInterval(function(){
        deployedInfoSyncJob.doJob();
        projectService.refreshMarathonLbInfo();
    },10000);*/
}