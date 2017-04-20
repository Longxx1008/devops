/**
 * Created by fujunou on 2015/3/6.
 */
var mysql = require('mysql');
module.exports = {
    extend: function(target, source, flag) {
        for(var key in source) {
            if(source.hasOwnProperty(key))
                flag ?
                    (target[key] = source[key]) :
                    (target[key] === void 0 && (target[key] = source[key]));
        }
        return target;
    },
    guidGenerator : function() {
        var S4 = function() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
    },

    jsonWrite : function (res, ret) {
        if(typeof ret === 'undefined') {
            res.json({
                code:'1',
                msg: '操作失败'
            });
        } else {
            res.json(ret);
        }
    },
    queryFormat : function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    },
    copyBeanProperties : function(targetObj, sourceObj){
        for(var p in sourceObj){
            if(targetObj.hasOwnProperty(p)){
                targetObj[p] = sourceObj[p];
            }
        }
    },
    formatInsertSql:function(obj){
        var sql = "";
        var tableName = obj.getTableName();
        sql += "insert into " + tableName + " set ";
        var value = '';
        for(var p in obj){
            if(typeof (obj[p]) == "function"){
                //函数不拼装sql
                continue;
            }else if(!obj[p]){
                //空值不插入
                continue;
            }else{
                value += p+" = "+mysql.escape(obj[p]) +"," ;
            }
        }
        if(value.length>0){
            value = value.substr(0,value.length-1);
        }
        sql += value;
        return sql;
    },
    formatUpdateSql:function(obj){
        var sql = "";
        var tableName = obj.getTableName();
        var pkColumn = obj.getPkColumnName();
        sql += "update " + tableName + " set ";
        var value = '';
        for(var p in obj){
            if(typeof (obj[p]) == "function"){
                //函数不拼装sql
                continue;
            }else if(!obj[p]){
                //空值不插入
                continue;
            }else if(p == pkColumn){
                //主键特殊处理
                continue;
            }else{
                value += p+" = "+mysql.escape(obj[p]) +"," ;
            }
        }
        if(value.length>0){
            value = value.substr(0,value.length-1);
        }
        sql += value + " where " + pkColumn +"="+mysql.escape(obj[pkColumn]);
        return sql;
    },
    sqlAppendWhereOrAnd:function(sql) {

        if (sql.indexOf("where") > 0) {
            sql += " and ";
        } else {
            sql += " where ";
        }
        return sql;
    }
}
