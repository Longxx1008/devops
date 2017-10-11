/**
 * Created by ShiHukui on 2016/3/1.
 */
var InitSys = function() {
    bootbox.setDefaults({locale:"zh_CN"});
    return {
        init : function() {

        },
        initMenu : function (code) {
            var currentMenu = $("a[href='"+code+"']");
            if(currentMenu.length > 0) {
                // 选中当前菜单
                currentMenu.parent().addClass('active');
                // 如果当前菜单非第一层
                if(!currentMenu.parent().parent().hasClass('sidebar-menu')){
                    // 检查第二层
                    if(currentMenu.parent().parent().hasClass('submenu')) {
                        currentMenu.parent().parent().parent().addClass('open');
                        if(currentMenu.parent().parent().parent().parent().hasClass('submenu')) {
                            currentMenu.parent().parent().parent().parent().parent().addClass('active open');
                            //currentMenu.parent().parent().parent().addClass('open');
                        }
                    }
                }
            }
        },
        initRevMenu:function(code) {
            var currentMenu = $("a[href='"+code+"']");
            if(currentMenu.length > 0) {
                if(currentMenu.parent().is('li')){
                    currentMenu.parent().addClass('nav-up-selected-inpage');
                }
                else {
                    var id = currentMenu.parent().parent().parent().parent().attr('id');
                    $("li[_t_nav='"+id+"']").addClass('nav-up-selected-inpage');
                }
            }
        },
        logout : function (url) {
            bootbox.confirm('确定注销本次登录？',function (result){
                if(result){
                    // 获取远程数据
                    $.ajax({
                        url: url + '/logout',
                        type: 'get',
                        data: {
                        },
                        success: function (data) {
                            if(data.success) {
                                location = data.data.url;//url + '/login';
                            }
                            else {
                                bootbox.alert('注销登录失败,请刷新页面后重试！', function(result){
                                });
                            }
                        }
                    });
                }
            });
        }
    }
}();

function openCurtUserRoleModal() {
    bootbox.dialog({
        message: $("#currentUserRoleModal").html(),
        title: '角色切换',
        className: "modal-blue",
        buttons: {
            "关闭": {
                className: "btn-danger",
                callback: function () {
                    $("#currentUserRoleModal").modal('hide');
                }
            }
        }
    });
}
function switchRole(url, roleid) {
    $.ajax({
        url: url + '/switchRole/'+roleid,
        type: 'get',
        data: {
        },
        success: function (data) {
            if(data.success) {
                bootbox.alert(data.msg, function(result){
                    if(data.code == '0000') {
                        location.reload();
                    }
                });
            }
            else {
                bootbox.alert(data.msg+',错误代码:'+data.code, function(result){
                });
            }
        }
    });
}

$.extend($.fn.dialog.methods, {
    addButtonsItem: function(jq, items){
        //$(this).parent().siblings('div.dialog-button').remove();
        //$('<div class="dialog-button"></div>').appendTo($(this).parent());
        return jq.each(function(){
            var buttonbar = $(this).parent().children("div.dialog-button");
            for(var i = 0;i<items.length;i++){
                var item = items[i];
                var btn=$('<button type="button" class="'+item.btnCls+'">' + item.text + '</button>');
                btn[0].onclick=eval(item.handler||function(){});
                btn.appendTo(buttonbar);
            }
        });
    }
});

$.fn.mydialog = function (options) {
    var defaults = {
        width: 300,
        height: 200,
        title: '此处标题',
        html: '',
        iconcls: '',
        myButtons:[]
    }
    var id = $(this).attr('id');
    options = $.extend(defaults, options);
    var self = this;
    $(self).dialog({
        title: options.title,
        height: options.height,
        width: options.width,
        iconcls: options.iconcls,
        top:options.top,
        modal: options.modal,
        buttons: []
    });
    $(self).dialog('addButtonsItem',options.myButtons);
};

(function($){
    $.fn.serializeJson=function(){
        var serializeObj={};
        var array=this.serializeArray();
        var str=this.serialize();
        $(array).each(function(){
            if(serializeObj[this.name] != undefined){
                if($.isArray(serializeObj[this.name])){
                    serializeObj[this.name].push(this.value);
                }else{
                    serializeObj[this.name]=[serializeObj[this.name],this.value];
                }
            }else{
                serializeObj[this.name]=this.value+'';
            }
        });
        //alert(JSON.stringify(serializeObj));
        return serializeObj;
    };
})(jQuery);

function msgError(msg) {
    Notify(msg, 'bottom-right', '5000', 'danger', 'fa-check', true);
}
function msgSuccess(msg) {
    Notify(msg, 'bottom-right', '5000', 'success', 'fa-check', true);
}
function msgWarning(msg) {
    Notify(msg, 'bottom-right', '5000', 'warning', 'fa-check', true);
}
function msgConfirm(msg, cb) {
    $.messager.confirm('提示', msg, function(result) {
        cb(result);
    });
}

(function($){
    var buttonDir = {north:'down',south:'up',east:'left',west:'right'};
    $.extend($.fn.layout.paneldefaults,{
        onBeforeCollapse:function(){
            /**/
            var popts = $(this).panel('options');
            var dir = popts.region;
            var btnDir = buttonDir[dir];
            if(!btnDir) return false;
            setTimeout(function(){
                var pDiv = $('.layout-button-'+btnDir).closest('.layout-expand').css({
                    textAlign:'center',lineHeight:'18px',fontWeight:'bold'
                });

                if(popts.title){
                    var vTitle = popts.title;
                    if(dir == "east" || dir == "west"){
                        var vTitle = popts.title;//.split('').join('<br/>');
                        //pDiv.find('.panel-body').html(replaceAll(vTitle,'(','︵<br/>'));
                        pDiv.find('.panel-body').html(vTitle.replace('(','︵<br/>').replace(')','<br/>︶'));
                        //pDiv.find('.panel-body').html(vTitle);
                    }else{
                        $('.layout-button-'+btnDir).closest('.layout-expand').find('.panel-title')
                            .css({textAlign:'left','height':'16px','line-height':'16px','font-size':'12px','color':'#333'})
                            .html(vTitle)
                    }

                }
            },100);

        }
    });

    $.fn.datebox.defaults.formatter = function(date){//对于时间格式的转换

        var y = date.getFullYear();
        var m = fullnum(date.getMonth()+1);
        var d = fullnum(date.getDate());
        return y+'-'+m+'-'+d;
    };
    function fullnum(obj){//对于月小于10格式的转换,因为Timestamp转换必须是2013-01-04这种格式
        if(Number(obj) < 10){
            return '0' + obj;
        }else{
            return obj;
        }
    }
    $.extend($.fn.validatebox.defaults.rules, {//验证开始时间小于结束时间
        gt: {
            validator: function(value, param){
                var sdate = $(param[0]).datetimebox('getValue');
                if(sdate) {
                    var d1 = $.fn.datebox.defaults.parser(sdate);
                    var d2 = $.fn.datebox.defaults.parser(value);
                    return d2 > d1;
                }
                else {// 如果开始时间为空则不验证
                    return true;
                }
            },
            message: '结束时间要大于开始时间！'
        }
    });

})(jQuery);



