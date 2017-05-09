var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var hbs = require('hbs');
var ueditor = require("ueditor")
//国际化
var i18n = require('i18n');
//config
var config = require('./config');
var app_init = require('./app_init');
//var memcached_utils = require('./app/common/core/utils/memcached_utils');
var coreService = require('./app/common/core/services/core_service');
var mqtt_init = require('./app/common/job/utils/mqtt_init');

var app = express();

var auth_check = require('./app/common/core/middlewares/auth_check');
// 路由自动挂载
var mount = require('./app/common/core/utils/mount_routes.js');
var tree_utils = require('./app/common/core/utils/tree_utils');
var param_filter = require('./app/common/core/filter/param_filter');

/*var logHelper = require('./app/common/log/utils/log_util.js');
 var seqHelper = require('./app/common/log/utils/sequence_util.js');

 //装载日志请求
 logHelper.use(app);

 //装载流水号中间件
 app.use(seqHelper.seqCreate);*/

//将全局配置信息传入locals
app.locals.projcfg = config.project;

//读取菜单信息传入locals
/*coreService.getSysMenu(function(result){
 if(result.success) {
 console.log("加载系统菜单成功");
 app.locals.sysmenus = result.data;
 }
 else {
 console.log("加载系统菜单失败");
 }
 });*/

i18n.configure({
    locales: ['zh_CN'],  // setup some i18n - other i18n default to en_US silently
    defaultLocale: 'zh_CN',
    directory: './views/common/i18n',
    updateFiles: false,
    indent: "\t",
    extension: '.json'  // 由于 JSON 不允许注释，所以用 js 会方便一点，也可以写成其他的，不过文件格式是 JSON
});

// 加载系统参数和数据字典
coreService.init();
// 初始化加载的内容
app_init.$(app);
// view engine setup
app.set('views', path.join(__dirname, 'views/'));

app.set('view engine', 'hbs');
//console.log(__dirname + '/views' + config.project.theme + '/partials');
hbs.registerPartials(__dirname + '/views/' + config.project.theme + 'partials');

var i18n_helpers = new require('./views/common/helpers/i18n_helpers');
hbs.registerHelper(i18n_helpers);

hbs.registerHelper('ifCond', function (v1, v2, options) {
    //console.log("v1: %s , v2: %s", v1, v2);
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('eq', function (v1, v2, options) {
    //console.log("v1: %s , v2: %s", v1, v2);
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('neq', function (v1, v2, options) {
    //console.log("v1: %s , v2: %s", v1, v2);
    if (v1 != v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('containKey', function (v1, v2, v3, options) {
    //console.log("v1: %s , v2: %s", v1, v2);
    var super_users = config.routes.super_users;
    var is_super_user = false;
    if (super_users) {
        super_users.forEach(function (item) {
            // 检查规则里面是否存在通配符
            is_super_user = is_super_user || item == v3;
        });
    }
    if (is_super_user) {
        return options.fn(this);
    }
    if (v1) {
        if (v1.hasOwnProperty(v2)) {
            return options.fn(this);
        }
    }
    return options.inverse(this);
});

/**
 * 有一个异常未处理,当v1 V2 为数字时会发生异常
 *
 */
hbs.registerHelper('ifContain', function (v1, v2, options) {

    if (v1.indexOf(v2) === 0) {
        return options.fn(this);
    }
    return options.inverse(this);
});
/**
 * json object转换为string
 */
hbs.registerHelper('tostring', function (v1, options) {

    return JSON.stringify(v1);
});
/**
 * json object转换为tree结构
 */
hbs.registerHelper('totree', function (v1, options) {

    return JSON.stringify(tree_utils.transData(v1, 'id', 'pid', 'children'));
});

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'static/images/favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//Mongo-Session
var MongoStore = require('connect-mongo')(session);
app.use(session({
    secret: config.session.secret,//'gmdp_client_secret',
    key: config.session.key,   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie_maxAge: config.session.cookie_maxAge,  //单位ms，即10分钟后session和相应的cookie失效过期
    resave: config.session.resave,
    saveUninitialized: config.session.saveUninitialized,
    rolling: config.session.rolling ? config.session.rolling : true,
    store: new MongoStore({
        url: config.session.mongodb_url ? config.session.mongodb_url : config.mongdb.url,
        interval: config.session.cookie_maxAge,
        collection:config.session.mongodb_collection ? config.session.mongodb_collection : 'common_user_session',
        touchAfter: 24 * 3600
    })
}));

//参数过滤防止xss攻击
app.use(param_filter);
app.use(config.project.appurl, express.static(path.join(__dirname, 'public')));

//国际化支持
app.use(i18n.init);
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
    // ueditor 客户发起上传图片请求
    if(req.query.action === 'uploadimage'){
        // 这里你可以获得上传图片的信息
        var foo = req.ueditor;
        console.log(foo.filename); // exp.png
        console.log(foo.encoding); // 7bit
        console.log(foo.mimetype); // image/png
        // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
        var img_url = 'upload';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage'){
        var dir_url = 'upload'; // 要展示给客户端的文件夹路径
        res.ue_list(dir_url) // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/project/static/js/ueditor/nodejs/config.json');
    }
}));
// 权限检查中间件
//app.use(auth_check);
var auth_type = config.auth.auth_type;
if (auth_type == 'cas') {
    var cas_client = require('./app/common/core/middlewares/cas_client');
    var local_login = require('./app/common/core/middlewares/local_login');
    var cas = new cas_client({
        cas_url: config.auth.cas_server_url,
        service_url: config.auth.cas_client_service_url,
        cas_version: !config.auth.cas_server_version ? '2.0' : config.auth.cas_server_version,
        renew: false,
        is_dev_mode: false,
        dev_mode_user: '',
        dev_mode_info: {},
        session_name: !config.auth.cas_client_session_name ? 'cas_sso_user' : config.auth.cas_client_session_name,
        session_info: !config.auth.cas_client_session_name ? 'cas_sso_user_info' : config.auth.cas_client_session_name + '_info',
        destroy_session: false
    });
    app.use(cas.bounce);
    //app.use(local_login);
}
// 权限检查中间件
app.use(auth_check);

//app.use('/', routes);
//app.use('/users', users);
mount(app, __dirname + '/app', config.routes.is_debug);
if (config.routes.welcome_path) {
    /*app.use('/', function(req, res) {
     res.redirect(config.routes.welcome_path);
     });*/
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('common/error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('common/error', {
        message: err.message,
        error: {}
    });
});

if(config.mqtt.is_use){
    // 初始化mqtt
    mqtt_init.init();
}

module.exports = app;
