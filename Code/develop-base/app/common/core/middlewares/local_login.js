var config = require('../../../../config');
var utils = require('../utils/app_utils');
var coreService = require('../services/core_service');
/**
 * 权限检查中间件
 * @param req
 * @param res
 * @param next
 */
module.exports = function(req, res, next) {

    // 检查是否需要登录之后才能访问
    if (/(^\/(static))|((.ico)$)/.test(req.url)) {
        next();
        return;
    }
    //console.log("auth_check:"+req.method + '|' + req.url);
    var exclude_auth_check_urls = config.routes.exclude_auth_check_urls;
    // 循环url
    var flag = false;
    exclude_auth_check_urls.forEach(function(item){
        // 检查规则里面是否存在通配符
        if(item.indexOf('*') == -1) {//console.log(eval('/^'+item+'/'));
            flag = flag || new RegExp("^"+item).test(req.url);
        }
        else {
            flag = flag || utils.wildcard(item, req.url);
        }
    });

    // 在排除列表中
    if(flag) {
        next();
    }
    else {

        if (req.session.current_user) {
            next();
        }
        else {
            var cas_user = req.session.cas_user;
            console.log('car_user:' + cas_user);
            if (cas_user) {
                var login_account = JSON.parse(cas_user).login_account;
                console.log('login_account:' + login_account);
                coreService.localLogin(login_account, function (result) {
                    if (result.success) {
                        // 保存当前用户信息至session
                        //req.session.current_user = result.data;
                        var current_user = result.data;

                        // 获取当前用户第一个角色所拥有的权限
                        var role = result.data.user_roles[0];
                        coreService.getMenusAndOptsByRole(role._id, function (result) {
                            if (result.success) {

                                var has_role_menus = {};
                                var has_role_menus_opts = {};

                                var items = result.data;
                                // 循环角色拥有的权限并存放至session

                                for (var i = 0; i < items.length; i++) {
                                    var item = items[i];
                                    //if(item==null)console.log(item.menu_id.menu_code);
                                    //console.log(item);
                                    has_role_menus[item.menu_id.menu_code] = item.menu_id;

                                    //has_role_menus[config.project.appurl + '/' + item.menu_id.menu_code] = item.menu_id;
                                    // 菜单用拥有的操作权限
                                    var menu_opts = item.menu_opts;
                                    for (var j = 0; j < menu_opts.length; j++) {
                                        var menu_opt = menu_opts[j];

                                        if (has_role_menus_opts.hasOwnProperty(menu_opt.opt_method)) {
                                            has_role_menus_opts[menu_opt.opt_method].push(menu_opt);
                                        }
                                        else {
                                            has_role_menus_opts[menu_opt.opt_method] = [menu_opt];
                                        }

                                    }
                                }
                                coreService.getSysMenu(function (sysMenuResult) {
                                    if (sysMenuResult.success) {

                                        //app.locals.sysmenus = result.data;

                                        req.session.save(function (err) {
                                            //req.session.current_user_roles = has_role_menus_opts;*/
                                            //req.session.current_user_roles = items;
                                            console.log("local_登录：" + err);
                                            // 保存当前用户
                                            req.session.current_user = current_user;
                                            // 保存当前角色所拥有的菜单权限
                                            req.session.current_user_role_menus = has_role_menus;
                                            // 保存当前角色所拥有的操作权限
                                            req.session.current_user_role_menus_opts = has_role_menus_opts;
                                            // 保存当前显示的角色
                                            req.session.current_user_role = role;
                                            // 保存系统菜单
                                            req.session.current_sys_menus = sysMenuResult.data;
                                            //res.end();
                                            // 跳转至主页面
                                            //res.redirect(config.project.appurl + "/home");
                                            // 跳转至当前系统配置的主页url上
                                            if (current_user.user_sys.sys_main_url) {
                                                //sleep(5000);
                                                //res.end("<script>location='"+current_user.user_sys.sys_main_url+"'</script>");
                                                console.log("local_login:" + req.url);
                                                next();
                                                //res.redirect(current_user.user_sys.sys_main_url);
                                            }
                                            else {
                                                res.status(500).send("错误：未定义系统" + current_user.user_sys.sys_name + "的主页属性[sys_main_url]");
                                            }
                                        });
                                    }
                                    else {
                                        res.render(config.project.theme + 'layout_login', {
                                            //layout:config.project.theme + 'layout',// 设置布局页面(默认：layout)
                                            message: '加载系统菜单出现异常，请联系管理员'
                                        });
                                    }
                                });
                            }
                            else {
                                res.render(config.project.theme + 'layout_login', {
                                    //layout:config.project.theme + 'layout',// 设置布局页面(默认：layout)
                                    message: '未给账号分配权限，请联系管理员'
                                });
                            }
                        });
                    }
                    else {
                        console.log(result.code + ":" + result.msg);
                        res.render(config.project.theme + 'layout_login', {
                            //layout:config.project.theme + 'layout',// 设置布局页面(默认：layout)
                            message: '账号或密码错误'
                        });
                    }
                });
            }
        }
    }
};
