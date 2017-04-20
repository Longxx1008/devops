var config = require("../../../../config"), utils = require("../utils/app_utils"), tree = require("../utils/tree_utils");
module.exports = function (b, e, d) {
    if (/(^\/(static))|(.*?(ico|jpg|gif|png|bmp|js|css)$)/.test(b.url))d(); else {
        var g = !1;
        config.routes.exclude_auth_check_urls.forEach(function (a) {
            g = -1 == a.indexOf("*") ? g || (new RegExp("^" + a)).test(b.url) : g || utils.wildcard(a, b.url)
        });
        if (g)d(); else if (b.session.current_user) {
            var a = b.url, f = a.indexOf("?");
            -1 != f && (a = a.substring(0, f));
            if (a == config.project.appurl || a == config.project.appurl + "/" || a == config.project.appurl + "/undefined")return console.log("url:%s,sub_url:%s", b.url, a),
                e.redirect(b.session.current_user.user_sys.sys_main_url);
            var a = config.routes.super_users, k = !1;
            a && a.forEach(function (a) {
                k = k || a == b.session.current_user.login_account
            });
            if (k)d(); else {
                var h = !1;
                config.routes.logged_can_access_urls.forEach(function (a) {
                    h = -1 == a.indexOf("*") ? h || (new RegExp("^" + a)).test(b.url) : h || utils.wildcard(a, b.url)
                });
                if (h)d(); else if (utils.wildcard("*/api/*", b.url))if (c = b.url.indexOf("?"), a = b.url, -1 != c && (a = a.substring(0, c)), f = b.session.current_user_role_menus_opts[b.method.toLowerCase()]) {
                    for (var c =
                        !1, l = 0; l < f.length; l++)var m = f[l], c = c || (new RegExp("^" + config.project.appurl + m.opt_url.replace(/:\w+/g, "[^/]*") + "$")).test(a);
                    console.log(a + ",has_role:" + c);
                    c ? d() : utils.respMsg4Paging(e, !1, "3000", "\u65e0\u6743\u8bbf\u95ee", [], 0)
                } else utils.respMsg4Paging(e, !1, "3000", "\u65e0\u6743\u8bbf\u95ee", [], 0); else {
                    var f = b.session.current_user_role_menus, c = b.url.indexOf("?"), a = b.url;
                    -1 != c && (a = a.substring(0, c));
                    a = a.replace(config.project.appurl + "/", "");
                    console.log("\u83dc\u5355\u6743\u9650\u68c0\u67e5:" + a);
                    f[a] ?
                        d() : exports.toRenderNoPermission(b, e)
                }
            }
        } else console.log("return to login:" + b.session.current_user), e.redirect(config.project.appurl + "/login")
    }
};
exports.toRenderNoPermission = function (b, e) {
    var d = utils.getCurrentUser(b), g = d.user_sys.sys_theme_layout;
    e.render("common/nopermission", {
        message: "\u60a8\u7684\u6743\u9650\u4e0d\u8db3\uff0c\u8bf7\u5c1d\u8bd5\u5207\u6362\u89d2\u8272\u6216\u8054\u7cfb\u7ba1\u7406\u5458\uff01",
        error: {},
        currentUser: d,
        currentUserRoleMenus: utils.getCurrentUserRoleMenus(b),
        currentUserRole: utils.getCurrentUserRole(b),
        layout: g,
        sysmenus: tree.buildSysTree(utils.getCurrentSysMenus(b)),
        menu: {
            menu_code: "error", menu_name: "\u7cfb\u7edf\u63d0\u793a",
            menu_nav: "\u7cfb\u7edf\u63d0\u793a", menu_cls: "fa fa-warning"
        }
    })
};