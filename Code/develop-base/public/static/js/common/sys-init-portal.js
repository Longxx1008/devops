/**
 * Created by ShiHukui on 2016/3/1.
 */
var InitSys = function() {
    return {
        init : function() {

        },
        logout : function (url) {
            $.messager.confirm('系统提示','确定注销本次登录？',function (result){
                if(result){
                    // 获取远程数据
                    $.ajax({
                        url: url + '/logout',
                        type: 'get',
                        data: {
                        },
                        success: function (data) {
                            if(data.success) {
                                //location = url + '/login';
                                location = data.data.url;
                            }
                            else {
                                $.messager.alert('系统提示','注销登录失败,请刷新页面后重试！', 'info');
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
function msgConfirm(msg, cb) {
    $.messager.confirm('提示', msg, function(result) {
        cb(result);
    });
}


