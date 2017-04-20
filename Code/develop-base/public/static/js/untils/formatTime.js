/**
 * 格式化Time
 *
 * @param {Object}
 *            format
 * @return {TypeName}
 */
function formatTime(time, format) {
    var date = new Date(time);
    var year = (date.getYear() < 1900) ? date.getYear() + 1900 : date.getYear();
    var o = {
        "M+" : date.getMonth() + 1, // month
        "d+" : date.getDate(), // day
        "h+" : date.getHours(), // hour
        "m+" : date.getMinutes(), // minute
        "ss" : date.getSeconds(), // second
        "ms" : date.getMilliseconds()
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (year + "").substr(4
            - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;

}

/**
 * 获取随机4位数
 *
 */
function getRandomTo4(){
    var rNum;
    while(true){
        var xNum = Math.floor(Math.random()*10000);
        if(xNum > 999){
            rNum = xNum.toString();
            break;
        }else continue;
    }

    return rNum;
}

/**
 * 金额格式化
 * @param s
 * @param n
 * @returns {string}
 */
function formatMoney(s, n)
{
    n = n > 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for(i = 0; i < l.length; i ++ )
    {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return t.split("").reverse().join("") + "." + r;
}

/**
 * 校验金额保留两位小数
 */
$.extend($.fn.validatebox.defaults.rules, {
    money: {
        validator: function(value){
            return (/^[0-9]+\.{0,1}[0-9]{0,2}$/.test(value)) && value <= 99999999.99;
        },
        message: '金额格式 100.00，最大值 99999999.99'
    }
});

/**
 * 进度校验
 */
$.extend($.fn.validatebox.defaults.rules, {
    progress: {
        validator: function(value){
            return (/^\d+$/.test(value)) && value <= 100;
        },
        message: '只能输入0~100的整数'
    }
});


/**
 * 控制最大输入字符长度
 */
$.extend($.fn.validatebox.defaults.rules, {
    maxLength: {
        validator: function(value, param){
            return value.length <= param[0];
        },
        message: '输入内容过长'
    }
});
