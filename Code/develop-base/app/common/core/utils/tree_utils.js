/**
 * Created by ShiHukui on 2016/2/29.
 */
var containArray = new Array();
var containEuiArray = new Array();

function buildChildTree(key, nodes) {
    var child = new Array();

    for(var i = 0; i < nodes.length; i++) {
        var nodeItem = nodes[i];
        var json = nodeItem;//shallowClone(nodeItem._doc);
        if(containArray.join(',').indexOf(nodeItem._id) == -1) {
            if(key == nodeItem.menu_pid) {
                var cchild = buildChildTree(nodeItem._id, nodes);
                if(cchild.length > 0) {
                    json.children = cchild;
                }
                containArray.push(nodeItem._id);
                child.push(json);
            }
        }
    }
    return child;
}
function shallowClone(obj){
    var clone = {};
    for(var p in obj){
        if(obj.hasOwnProperty(p)){
            clone[p] = obj[p];
        }
    }
    return clone;
}
exports.buildTree = function(nodes) {
    var tree = new Array();
    if(null != nodes) {
        containArray = new Array();
        for(var i = 0; i < nodes.length; i++) {
            var nodeItem = nodes[i];
            var json = nodeItem;//shallowClone(nodeItem._doc);
            //console.log("json:"+JSON.stringify(json));
            if(containArray.join(',').indexOf(nodeItem._id) == -1) {
                var child = buildChildTree(nodeItem._id, nodes);
                // 递归增加子节点
                if(child.length > 0) {
                    json.children = child;
                }
                containArray.push(nodeItem._id);
                tree.push(json);
            }
        }
    }
    return tree;
}

function buildSysMenuChildTree(key, nodes) {
    var child = new Array();

    for(var i = 0; i < nodes.length; i++) {
        var nodeItem = nodes[i];
        var json = nodeItem;//shallowClone(nodeItem._doc);
        if(containArray.join(',').indexOf(nodeItem._id) == -1 && nodeItem.menu_hidden == 0) {
            if(key == nodeItem.menu_pid) {
                var cchild = buildSysMenuChildTree(nodeItem._id, nodes);
                if(cchild.length > 0) {
                    json.children = cchild;
                }
                containArray.push(nodeItem._id);
                child.push(json);
            }
        }
    }
    return child;
}

exports.buildSysMenuTree = function(nodes) {
    var tree = new Array();
    if(null != nodes) {
        containArray = new Array();
        for(var i = 0; i < nodes.length; i++) {
            var nodeItem = nodes[i];
            var json = nodeItem;//shallowClone(nodeItem._doc);
            //console.log("json:"+JSON.stringify(json));
            if(containArray.join(',').indexOf(nodeItem._id) == -1 && nodeItem.menu_hidden == 0) {
                var child = buildSysMenuChildTree(nodeItem._id, nodes);
                // 递归增加子节点
                if(child.length > 0) {
                    json.children = child;
                }
                containArray.push(nodeItem._id);
                tree.push(json);
            }
        }
    }
    return tree;
}

/**
 * 按系统构建对应的树
 * @param nodes
 */
exports.buildSysTree = function(nodes) {
    var tree = exports.buildSysMenuTree(nodes);
    //var tree = exports.transData(nodes, "_id", "menu_pid", "children");
    //console.log(JSON.stringify(tree));
    var map = {};
    tree.forEach(function(item){
        if(map.hasOwnProperty(item.menu_sysid)) {
            map[item.menu_sysid].push(item);
        }
        else {
            map[item.menu_sysid] = [item];
        }
    });

    return map;
}


function buildEasyuiChildTree(key, nodes, id, text, parentid, attributes) {
    var child = new Array();

    for(var i = 0; i < nodes.length; i++) {
        var nodeItem = nodes[i];
        var returnJson = {};
        var json = shallowClone(nodeItem._doc);
        if(containEuiArray.join(',').indexOf(nodeItem[id]) == -1) {
            if(key == eval('nodeItem.' + parentid)) {
                var cchild = buildEasyuiChildTree(nodeItem[id], nodes, id, text, parentid, attributes);
                if(cchild.length > 0) {
                    returnJson.children = cchild;
                }

                // 构建easyui tree
                returnJson.id = eval('json.' + id) + '';
                returnJson.text = eval('json.' + text);

                if(attributes) {
                    var attrMap = {};
                    for(var i = 0; i < attributes.length; i++) {
                        attrMap[attributes[i]] = eval('json.' + attributes[i]);
                    }
                    returnJson.attributes = attrMap;
                }

                containEuiArray.push(nodeItem[id]);
                child.push(returnJson);
            }
        }
    }
    return child;
}

/**
 * 构建easyui树
 * @param nodes
 * @returns {Array}
 */
exports.buildEasyuiTree = function(nodes, id, text, parentid, attributes) {
    var tree = new Array();
    if(null != nodes) {
        containEuiArray = new Array();
        for(var i = 0; i < nodes.length; i++) {
            var nodeItem = nodes[i];
            var returnJson = {};
            var json = shallowClone(nodeItem._doc);
            if(containEuiArray.join(',').indexOf(nodeItem[id]) == -1) {
                var child = buildEasyuiChildTree(nodeItem[id], nodes, id, text, parentid);
                // 递归增加子节点
                if(child.length > 0) {
                    returnJson.children = child;
                }

                // 构建easyui tree
                returnJson.id = eval('json.' + id) + '';
                returnJson.text = eval('json.' + text);
                if(attributes) {
                    var attrMap = {};
                    for(var i = 0; i < attributes.length; i++) {
                        attrMap[attributes[i]] = eval('json.' + attributes[i]);
                    }
                    returnJson.attributes = attrMap;
                }
                containEuiArray.push(nodeItem[id]);
                tree.push(returnJson);
            }
        }
    }
    return tree;
}

exports.transData = function(a, idStr, pidStr, chindrenStr){
    var r = [], hash = {}, id = idStr, pid = pidStr, children = chindrenStr, i = 0, j = 0, len = a.length;
    for(; i < len; i++){
        hash[a[i][id]] = a[i];
    }
    for(; j < len; j++){
        var aVal = a[j], hashVP = hash[aVal[pid]];
        if(hashVP){
            !hashVP[children] && (hashVP[children] = []);
            hashVP[children].push(aVal);
        }else{
            r.push(aVal);
        }
    }
    return r;
}
