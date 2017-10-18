/* 
create by heidngxin 17.10.16
*/
var utils = require('../../../common/core/utils/app_utils');
var mysqlPool = require('../../utils/mysql_pool');
var config = require('../../../../config');

var https = require('https');
exports.pageList = async function (page,size,conditionMap) {
    /**
 * 查询资源列表
 * @param page
 * @param size
 * @param conditionMap
 * @returns Array<object>
 */
return [{
        id: 1,
    resource_number: '12312398sdasd',
        resource_name: 'mysql',
        resource_state: 1,//  运行中 停止了
        resource_apply: 'fttts',/* 实例名称 */
        resource_count: 30,/* 资源占用情况 */
        resource_remark: '我是备注',/* 备注 */
        occupy_use:30,/* 占用值 */
        occupy:100/* 总值 */
    }]
}
/** 
*@param id  
*@returns object
*/

exports.getResource=async function (id){
    return {  id: 1,
        resource_number: '12312398sdasd',
        resource_name: 'mysql',
        resource_state: 1,//  运行中 停止了
        resource_apply: 'fttts',/* 实例名称 */
        resource_count: 30,/* 资源占用情况 */
        resource_remark: '我是备注'/* 备注 */
    }
}