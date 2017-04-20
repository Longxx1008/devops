/**
 * Created by liping on 2017-4-1.
 * 日期操作工具类
 */
var DateUtils = {
    /**
     * 获取当前时间
     * @returns {Date}
     */
    now:function(){
        return new Date();
    },

    /**
     * 日期对象格式化
     * @param date  要格式化的日期对象
     * @param format
     * @returns {*}
     */
    format:function(date,format){
        var year = (date.getYear() < 1900) ? date.getYear() + 1900 : date.getYear();
        var o = {
            "M+" :  date.getMonth() + 1,  //month
            "d+" :  date.getDate(),     //day
            "h+" :  date.getHours(),    //hour
            "m+" :  date.getMinutes(),  //minute
            "ss" :  date.getSeconds(), //second
            "ms" :  date.getMilliseconds()
        };

        if(/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (year+"").substr(4 - RegExp.$1.length));
        }

        for(var k in o) {
            if(new RegExp("("+ k +")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
            }
        }
        return format;
    },

    /**
     * 日期加减，返回新的日期对象
     * @param date 原始日期对象
     * @param amount 增量
     * @param type 类型 Y:年,M:月,D:日
     */
    dateAdd:function(date,amount,type){
        if(type == 'D'){
            date.setDate(date.getDate() + amount);
        }else if(type == 'M'){
            date.setMonth(date.getMonth() + amount);
        }else if(type == 'Y'){
            date.setFullYear(date.getFullYear() + amount);
        }else{
            date.setDate(date.getDate() + amount);
        }
        return date;
    }
};


module.exports = DateUtils;