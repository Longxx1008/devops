var express = require("express"), router = express.Router(), captchapng = require("captchapng"), config = require("../../../../config"), utils = require("../utils/app_utils"), tree = require("../utils/tree_utils"), coreService = require("../services/core_service.js"), memcached_utils = require("../utils/memcached_utils");
router.route("/portal").get(function (a, c) {
    var d = utils.getCurrentUser(a), b = utils.getCurrentUserRole(a);
    if (d) {
        var e = d.user_sys._id;
        coreService.getPortalPage(e, function (h) {
            if (h.success) {
                var p = h.data.page_body, q = h.data.page_layout, n = h.data.page_layout_col_type;
                n || (n = "1:1:1");
                var n = n.split(":"), m = [], g = 0;
                n.forEach(function (a) {
                    g += parseInt(a)
                });
                n.forEach(function (a) {
                    m.push(parseInt(a) / g * 100)
                });
                coreService.getPortalModuleList(e, b._id, function (b) {
                    c.render(config.project.appviewurl + p, {
                        layout_id: h.data._id,
                        layout: q,
                        layout_cols: m,
                        layout_modules: h.data.page_layout_modules,
                        layout_all_modules: b.data,
                        currentUser: d,
                        currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
                        currentUserRole: utils.getCurrentUserRole(a),
                        sysmenus: tree.buildSysTree(utils.getCurrentSysMenus(a))
                    })
                })
            } else c.render(config.project.appviewurl + "common/portal/template/tpl_default", {
                layout: "themes/portal_eui/layout",
                layout_cols: m,
                layout_modules: h.data.page_layout_modules,
                currentUser: d,
                currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
                currentUserRole: utils.getCurrentUserRole(a),
                sysmenus: tree.buildSysTree(utils.getCurrentSysMenus(a))
            })
        })
    } else c.render(config.project.appviewurl + "common/portal/template/tpl_default", {layout: "themes/portal_eui/layout"})
});
router.route("/admin/api/portal/layout/:id").put(function (a, c) {
    var d = a.params.id, b = a.body.mids;
    if (d) {
        var e = utils.getCurrentUser(a);
        coreService.updatePortalPageHasModules(e._id, d, b, function (a) {
            utils.respJsonData(c, a)
        })
    } else utils.respMsg(c, !1, "2001", "\u9875\u9762id\u4e0d\u80fd\u4e3a\u7a7a\u3002", null, null)
});
router.route("/portal/module/:id").get(function (a, c) {
    var d = a.params.id;
    if (d) {
        var b = utils.getCurrentUser(a), e = utils.getCurrentUserRole(a);
        b ? coreService.getPortalModule(b.user_sys._id, d, e._id, function (a) {
            a.success ? /^http:\/\/+/.test(a.data.module_url) ? c.render(config.project.appviewurl + "common/portal/modules/module_frame", {
                url: a.data.module_url + (a.data.module_params ? "?" + a.data.module_params : ""),
                id: a.data._id,
                exid: utils.getUUID(),
                layout: !1
            }) : c.render(config.project.appviewurl + a.data.module_url, {
                id: a.data._id,
                exid: utils.getUUID(), params: a.data.module_params ? a.data.module_params : "", layout: !1
            }) : c.render(config.project.appviewurl + "common/portal/modules/module_error", {
                layout: !1,
                msg: "\u6a21\u5757\u5df2\u88ab\u505c\u7528\u6216\u65e0\u6743\u8bbf\u95ee"
            })
        }) : c.render(config.project.appviewurl + "common/portal/modules/module_error", {
            layout: !1,
            msg: "\u767b\u9646\u8d85\u65f6\uff0c\u8bf7\u91cd\u65b0\u767b\u9646"
        })
    } else c.render(config.project.appviewurl + "common/portal/modules/module_error", {
        layout: !1,
        msg: "\u6a21\u5757\u4e0d\u5b58\u5728"
    })
});
function toLogin(a, c) {
    a.render(config.project.theme + "layout_login", {
        key_1: config.auth.password.key_1,
        key_2: config.auth.password.key_2,
        key_3: utils.encryptDataByMD5(config.auth.password.key_3_prefix + utils.formatTime("yyyyMMdd")),
        message: c
    })
}
router.route("/login").get(function (a, c) {
    "cas" == config.auth.auth_type ? c.redirect(config.project.appurl) : toLogin(c, "")
}).post(function (a, c) {
    var d = a.body.username, b = a.body.password, e = a.body.captcha;
    console.log(d);
    console.log("name:%s ; pwd: %s", d, b);
    if (d)if (b)if (config.project.captcha_login_enable && !e)toLogin(c, "\u9a8c\u8bc1\u7801\u4e0d\u80fd\u4e3a\u7a7a\u3002"); else {
        if (config.project.captcha_login_enable) {
            if (a.session[config.project.captcha_session_key] != e) {
                toLogin(c, "\u9a8c\u8bc1\u7801\u4e0d\u6b63\u786e\u3002");
                return
            }
            a.session[config.project.captcha_session_key] = null
        }
        b = utils.decryptData(b, config.auth.password.key_1, config.auth.password.key_2, utils.encryptDataByMD5(config.auth.password.key_3_prefix + utils.formatTime("yyyyMMdd")));
        console.log("decrypt pwd:" + b);
        coreService.userLogin(d, b, function (b) {
            if (b.success) {
                var d = b.data, e = b.data.user_roles[0];
                coreService.getMenusAndOptsByRole(e._id, function (b) {
                    if (b.success) {
                        var h = {}, g = {};
                        b = b.data;
                        for (var l = 0; l < b.length; l++) {
                            var f = b[l];
                            if (f.menu_id != null) {
                                h[f.menu_id.menu_code] = f.menu_id;
                            }
                            for (var f = f.menu_opts, t = 0; t < f.length; t++) {
                                var k = f[t];
                                g.hasOwnProperty(k.opt_method) ? g[k.opt_method].push(k) : g[k.opt_method] = [k]
                            }
                        }
                        coreService.getSysMenu(function (b) {
                            b.success ? a.session.save(function (f) {
                                console.log("\u767b\u9646\uff1a" + f);
                                a.session.current_user = d;
                                a.session.current_user_role_menus = h;
                                a.session.current_user_role_menus_opts = g;
                                a.session.current_user_role = e;
                                a.session.current_sys_menus = b.data;
                                d.user_sys.sys_main_url ? c.end("<script>location='" + d.user_sys.sys_main_url + "'\x3c/script>") : c.status(500).send("\u9519\u8bef\uff1a\u672a\u5b9a\u4e49\u7cfb\u7edf" +
                                    d.user_sys.sys_name + "\u7684\u4e3b\u9875\u5c5e\u6027[sys_main_url]")
                            }) : toLogin(c, "\u52a0\u8f7d\u7cfb\u7edf\u83dc\u5355\u51fa\u73b0\u5f02\u5e38\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458")
                        })
                    } else toLogin(c, "\u672a\u7ed9\u8d26\u53f7\u5206\u914d\u6743\u9650\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458")
                })
            } else console.log(b.code + ":" + b.msg), "1008" == b.code ? toLogin(c, b.msg) : toLogin(c, "\u8d26\u53f7\u6216\u5bc6\u7801\u9519\u8bef")
        })
    } else toLogin(c, "\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a"); else toLogin(c, "\u8d26\u53f7\u4e0d\u80fd\u4e3a\u7a7a\u3002")
});
function sleep(a) {
    for (var c = Date.now(); Date.now() - c <= a;);
}
router.route("/logout").get(function (a, c) {
    utils.clearSession(a);
    "cas" == config.auth.auth_type ? utils.respMsg(c, !0, "0000", "\u6ce8\u9500\u767b\u9646\u6210\u529f", {url: config.auth.cas_server_url + "/logout?service=" + config.auth.cas_client_service_url + config.project.appurl}, null) : utils.respMsg(c, !0, "0000", "\u6ce8\u9500\u767b\u9646\u6210\u529f", {url: config.project.appurl + "/login"}, null)
});
router.route("/public/sysData").get(function (a, c) {
    coreService.getSysData(function (a) {
        utils.respJsonData(c, a)
    })
});
router.route("/public/orgTreeData").get(function (a, c) {
    coreService.getOrgTreeData(function (a) {
        utils.respJsonData(c, a)
    })
});
router.route("/public/orgRootTreeData").get(function (a, c) {
    coreService.getOrgTreeData(function (a) {
        utils.respJsonData(c, [{
            id: "0",
            text: config.datas.tree_org.root_node_name ? config.datas.tree_org.root_node_name : "\u8d35\u5dde\u79fb\u52a8",
            children: a
        }])
    })
});
router.route("/public/dict/:code").get(function (a, c) {
    var d = a.params.code;
    d ? memcached_utils.getDict(function (a, e) {
        utils.respJsonData(c, tree.transData(e[d], "id", "pid", "children"))
    }) : utils.respJsonData(c, [])
});
router.route("/captcha").get(function (a, c) {
    var d = Math.pow(10, Math.floor(4 + 3 * Math.random()) - 1), b = parseInt(9 * Math.random() * d + d);
    a.session.save(function (e) {
        console.log("captcha:" + b);
        a.session[config.project.captcha_session_key] = b;
        e = new captchapng(86, 34, b);
        e.color(Math.floor(160 + 40 * Math.random()), Math.floor(160 + 40 * Math.random()), Math.floor(160 + 40 * Math.random()), 140);
        e.color(Math.floor(20 * Math.random() + 110), Math.floor(20 * Math.random() + 110), Math.floor(20 * Math.random() + 110), 255);
        e = e.getBase64();
        e = new Buffer(e,
            "base64");
        c.writeHead(200, {"Content-Type": "image/png"});
        c.end(e)
    })
});
router.route("/switchRole/:roleid").get(function (a, c) {
    var d = a.params.roleid, b = a.session.req.session.current_user_role;
    console.log(d + "," + b._id);
    d == b._id ? utils.respMsg(c, !0, "0001", "\u5f53\u524d\u5df2\u663e\u793a\u8be5\u89d2\u8272\u6743\u9650", null, null) : coreService.hasRoleByUser(a.session.current_user._id, d, function (b) {
        if (b.success) {
            var d = b.data;
            coreService.getMenusAndOptsByRole(d._id, function (b) {
                if (b.success) {
                    var e = {}, n = {};
                    b = b.data;
                    for (var m = 0; m < b.length; m++) {
                        var g = b[m];
                        e[g.menu_id.menu_code] = g.menu_id;
                        for (var g = g.menu_opts, l = 0; l < g.length; l++) {
                            var f = g[l];
                            n.hasOwnProperty(f.opt_method) ? n[f.opt_method].push(f) : n[f.opt_method] = [f]
                        }
                    }
                    a.session.current_user_role_menus = e;
                    a.session.current_user_role_menus_opts = n;
                    a.session.current_user_role = d;
                    utils.respMsg(c, !0, "0000", "\u5207\u6362\u89d2\u8272\u6210\u529f", null, null)
                } else utils.respMsg(c, !1, "1005", "\u5207\u6362\u89d2\u8272\u5931\u8d25[\u672a\u7ed9\u8d26\u53f7\u5206\u914d\u6743\u9650\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458]", null, null)
            })
        } else utils.respJsonData(c,
            b)
    })
});
router.route("/:code").get(function (a, c) {
    var d = a.params.code;
    console.log("menu_code:" + d);
    var b = getMenuInfo(a, d), e = utils.getCurrentUser(a), h = e.user_sys.sys_theme_layout;
    console.log("\u5e03\u5c40\u6587\u4ef6\uff1a" + h);
    var p = utils.getCurrentUserRole(a), q = a.param("reqparams");
    console.log("reqparams:" + q);
    memcached_utils.getSysParam(a, function (d) {
        memcached_utils.getDict(function (m, g) {
            if (b && 0 == b.menu_type)coreService.getPortalPageByCode(b.menu_sysid, p._id, b.menu_url, function (f) {
                if (f.success) {
                    var l = f.data.page_body,
                        k = f.data.page_layout_col_type;
                    k || (k = "1:1:1");
                    var k = k.split(":"), m = [], r = 0;
                    k.forEach(function (a) {
                        r += parseInt(a)
                    });
                    k.forEach(function (a) {
                        m.push(parseInt(a) / r * 100)
                    });
                    0 == f.data.page_is_customize ? coreService.getPortalModuleList(b.menu_sysid, p._id, function (k) {
                        c.render(config.project.appviewurl + l, {
                            layout_id: f.data._id,
                            layout: 0 == b.menu_use_sys_layout ? !1 : h,
                            layout_cols: m,
                            layout_modules: f.data.page_layout_modules,
                            layout_all_modules: k.data,
                            currentUser: e,
                            currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
                            currentUserRole: p,
                            sysmenus: tree.buildSysTree(utils.getCurrentSysMenus(a)),
                            can_customize: 0 == b.menu_type && 1 == f.data.page_is_customize && utils.hasOptRole(a, "put", "custom_portal_layout"),
                            menu: b,
                            layout_module_types: g.common_portal_module_type,
                            commonDictData: g,
                            commonSysParamData: d,
                            reqparams: q
                        })
                    }) : coreService.getPortalPagePersonal(e._id, p._id, f.data._id, function (k) {
                        var r = null, r = k.success ? k.data.page_layout_modules : f.data.page_layout_modules;
                        coreService.getPortalModuleList(b.menu_sysid, p._id, function (k) {
                            c.render(config.project.appviewurl +
                                l, {
                                layout_id: f.data._id,
                                layout: 0 == b.menu_use_sys_layout ? !1 : h,
                                layout_cols: m,
                                layout_modules: r,
                                layout_all_modules: k.data,
                                currentUser: e,
                                currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
                                currentUserRole: p,
                                sysmenus: tree.buildSysTree(utils.getCurrentSysMenus(a)),
                                can_customize: 0 == b.menu_type && 1 == f.data.page_is_customize && utils.hasOptRole(a, "put", "custom_portal_layout"),
                                menu: b,
                                layout_module_types: g.common_portal_module_type,
                                commonDictData: g,
                                commonSysParamData: d,
                                reqparams: q
                            })
                        })
                    })
                } else c.render(config.project.appviewurl +
                    "common/portal/template/tpl_default", {
                    message: "\u52a0\u8f7dportal\u9875\u9762\u51fa\u73b0\u5f02\u5e38",
                    layout: 0 == b.menu_use_sys_layout ? !1 : h,
                    currentUser: e,
                    currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
                    currentUserRole: utils.getCurrentUserRole(a),
                    sysmenus: tree.buildSysTree(utils.getCurrentSysMenus(a)),
                    menu: b,
                    commonDictData: g,
                    commonSysParamData: d
                })
            }); else if (b)c.render(config.project.appviewurl + b.menu_url, {
                layout: 0 == b.menu_use_sys_layout ? !1 : h,
                currentUser: e,
                currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
                currentUserRole: utils.getCurrentUserRole(a),
                sysmenus: tree.buildSysTree(utils.getCurrentSysMenus(a)),
                menu: b,
                commonDictData: g,
                commonSysParamData: d,
                reqparams: q
            }); else {
                var l = getMenuInfo(a, "home");
                c.render(config.project.appviewurl + l.menu_url, {
                    layout: 0 == l.menu_use_sys_layout ? !1 : h,
                    currentUser: e,
                    currentUserRoleMenus: utils.getCurrentUserRoleMenus(a),
                    currentUserRole: utils.getCurrentUserRole(a),
                    sysmenus: tree.buildSysTree(utils.getCurrentSysMenus(a)),
                    menu: l,
                    commonDictData: g,
                    commonSysParamData: d,
                    reqparams: q
                })
            }
        })
    })
});
function getMenuInfo(a, c) {
    var d = utils.getCurrentSysMenus(a), b = {};
    if (d && d != [])for (var e = 0; e < d.length; e++) {
        var h = d[e];
        b[h.menu_code] = h
    }
    return b[c]
}
module.exports = router;