/**
 * Created by Andrew on 2016/3/2.
 */
//日志部分配置
var log4js = require('log4js');
var fs = require("fs");
var path = require("path");


// 加载配置文件
var objConfig = JSON.parse(fs.readFileSync("log4js.json", "utf8"));


//log4js.configure('log4js.json',{ reloadSecs: 300 });
log4js.configure(objConfig);

module.exports={
    // 配合express用的方法
    use:function(app) {
        //页面请求日志, level用auto时,默认级别是WARN

        //logger.setLevel('INFO');
        var logger = log4js.getLogger('request_log');

        //  格式说明
        //*   - `:req[header]` ex: `:req[Accept]`
        //*   - `:res[header]` ex: `:res[Content-Length]`
        //*   - `:http-version`
        //*   - `:response-time`
        //*   - `:remote-addr`
        //*   - `:date`
        //*   - `:method`
        //*   - `:url`
        //*   - `:referrer`
        //*   - `:user-agent`
        //*   - `:status`



        var formatEx= ' "[:method] - "' +'[status: :status] [response-time: :response-time ms] - [:url] - [:remote-addr]';
        //var formatEx= ':remote-addr - -' +' ":method :url HTTP/:http-version"' +' :status :content-length ":referrer"' +' ":user-agent"';
        app.use(log4js.connectLogger(logger, {level: log4js.levels.DEBUG,format: formatEx}));


    },
    /**
     * 根据类别获取日志
     * @param loggerCategoryName 日志类别名称
     * @returns {Logger}
     */
    getLogger:function(loggerCategoryName){

    var loggerCaName=loggerCategoryName || 'request_log'

    return log4js.getLogger(loggerCaName);
    },
    log4js:log4js
}


