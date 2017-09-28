var context = "";
var __loginStatus = 0;
var salt;
var butstyle = '';

function __alert(txt){
	var layerIndex = layer.open({
        type: 1
        ,offset: 'auto' //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
        ,id: 'LAY_demo_auto' //防止重复弹出
        ,content: '<div style="padding: 20px 100px;">'+ txt +'</div>'
        ,btn: '关闭'
        ,btnAlign: 'c' //按钮居中
        ,shade: 0 //不显示遮罩
        ,yes: function(){
          	layer.close(layerIndex);
        }
	});
}

function __checkLogin(){
	$.getJSON(context + "/app/store",{m:'check'},function(data){
		console.log(data);
		if(data.user == null || data.user.loginName == null){
			__loginStatus = 0;
			butstyle = 'display:none';
			$("#installed").addClass("hide");
			$("#nologin").removeClass("hide");
			$("#islogin").find("span").html("");
			//$("#islogin").addClass("hide");
		}else{
			__loginStatus = 1;
			butstyle = '';
			$("#installed").removeClass("hide");
			$("#nologin").addClass("hide");
			$("#islogin").find("span").html("欢迎您！" + data.user.loginName);
			//$("#islogin").removeClass("hide");
		}
		console.log("__loginStatus:" + __loginStatus);
	});
}

function refersh(){
	$("#imageCode").attr("src",context + "/imageCode?r=" + Math.random());
}

function __login(flag){
  var username = $("#username").val();
  var password = $("#password").val();
  var code = $("#code").val();
  if(username == null || username == ""){
  	layer.msg('用户名不能为空');
	return;
  }
  if(password == null || password == ""){
  	layer.msg('密码不能为空');
	return;
  }
  if(code == null || code == ""){
  	layer.msg('验证码不能为空');
	return;
  }
  //先检查验证码
  /*$.post(context + "/app/store",{m:'valiCode',code:code},function(data){
	  if(data.result){*/
		  $.post(context + "/app/store",{m:'login',username:username,password:md5(salt + password),code:code},function(data){
			  //刷新验证码
			  refersh();
			  if(data.result){//登录成功
				  $('#__loginModal').modal('hide');
				  layer.msg("登录成功");
				  __checkLogin();
				  if(flag){
					  searchData();
				  }
			  }else{
				  layer.msg(data.msg);
			  }
		  },"json");
	  /*}else{
		  layer.msg("验证码错误");
		  refersh();
	  }
  },"json");*/
}

function __logout(){
	if(confirm("确定要退出吗？")){
		$.getJSON(context + "/app/store",{m:'logout'},function(data){
			window.location.href = "index.html";
		});
	}
}

function __server(){
	if(__loginStatus == 0){
		__login();
	}else{
		window.location.href = "install.html";
	}
}

function __install(){
	if(__loginStatus == 0){
		$('#__loginModal').modal('show');
	}else{
		$('#__installModal').modal('show');
	}
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
}

function getSalt(){
	$.getJSON(context + "/app/store",{m:'salt'},function(data){
		salt = data.msg;
	});
}

getSalt();
//__checkLogin();
