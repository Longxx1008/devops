/**
 * 容器列表数据
 * @type {*[]}
 */
var containerlistdata  = [
    {
        "con_code": "C301001",
        "con_name": "develop-base-nginx1",
        "health_condition": "正常",
        "status": "运行中",
        "cpu": "1.0",
        "memory": "128MiB",
        "con_image": "daocloud.io/library/nginx<br/>1.7.1",
        "remark": "容器信息"
    },
    {
        "con_code": "C301002",
        "con_name": "develop-base-web1",
        "health_condition": "正常",
        "status": "运行中",
        "cpu": "1.0",
        "memory": "128MiB",
        "con_image": "daocloud.io/library/tomcat<br/>8.0.5",
        "remark": "容器信息"
    },
    {
        "con_code": "C301003",
        "con_name": "develop-base-web2",
        "health_condition": "正常",
        "status": "运行中",
        "cpu": "1.0",
        "memory": "128MiB",
        "con_image": "daocloud.io/library/tomcat<br/>1.7.1",
        "remark": "容器信息"
    },
    {
        "con_code": "C301004",
        "con_name": "develop-base-db",
        "health_condition": "正常",
        "status": "运行中",
        "cpu": "1.0",
        "memory": "128MiB",
        "con_image": "ddaocloud.io/library/mysql<br/>5.5.0",
        "remark": "容器信息"
    }
];
/**
 * 镜像仓库  我的镜像数据
 * @type {*[]}
 */
var mydockerdata  = [
    {
        "docker_code": "C301002",
        "docker_resource": "daocloud.io/develop-base-web1",
        "versions": "1.2.1",
        "createtime": "1天前",
        "updatetime": "10分钟前",
        "remark": "镜像信息"
    }
];
/**
 * 镜像仓库 收藏夹数据
 * @type {*[]}
 */
var favoritesdata  = [
    {
        "docker_code": "C301001",
        "docker_resource": "daocloud.io/nginx",
        "versions": "1.7.1",
        "createtime": "1月前",
        "updatetime": "10天前",
        "remark": "镜像信息"
    }
];
/**
 * 服务管理数据数据
 * @type {*[]}
 */
var servciesdata  = [
    {
        "service_code": "C301001",
        "service_name": "酬金数据",
        "createtime": "2017-01-01 00:00:00",
        "status": "使用中",
        "remark": "服务数据信息"
    },
    {
        "service_code": "C301002",
        "service_name": "经分数据",
        "createtime": "2017-01-01 00:00:00",
        "status": "使用中",
        "remark": "服务数据信息"
    }
];

/**
 * 服务管理能力数据
 * @type {*[]}
 */
var servciesAbilitydata  = [
    {
        "service_code": "C301001",
        "service_name": "短信",
        "createtime": "2017-01-01 00:00:00",
        "status": "使用中",
        "remark": "调用频率限制：5000条/小时"
    },
    {
        "service_code": "C301002",
        "service_name": "多方通话",
        "createtime": "2017-01-01 00:00:00",
        "status": "使用中",
        "remark": "服务能力信息"
    },
    {
        "service_code": "C301003",
        "service_name": "视频",
        "createtime": "2017-01-01 00:00:00",
        "status": "使用中",
        "remark": "服务能力信息"
    }
];

/**
 * 容器管理数据
 * @type {*[]}
 */
var containermanagedata  = [
    {
        "con_code": "C301001",
        "con_name": "develop-base-nginx1",
        "con_project": "业务酬金稽核",
        "health_condition": "正常",
        "status": "运行中",
        "cpu": "1.0",
        "memory": "128MiB",
        "con_image": "daocloud.io/library/nginx<br/>1.7.1",
        "remark": "容器信息"
    },
    {
        "con_code": "C301002",
        "con_name": "develop-base-web1",
        "con_project": "业务酬金稽核",
        "health_condition": "正常",
        "status": "运行中",
        "cpu": "1.0",
        "memory": "128MiB",
        "con_image": "daocloud.io/library/tomcat<br/>8.0.5",
        "remark": "容器信息"
    },
    {
        "con_code": "C301003",
        "con_name": "develop-base-web2",
        "con_project": "业务酬金稽核",
        "health_condition": "正常",
        "status": "运行中",
        "cpu": "1.0",
        "memory": "128MiB",
        "con_image": "daocloud.io/library/tomcat<br/>1.7.1",
        "remark": "容器信息"
    },
    {
        "con_code": "C301004",
        "con_name": "develop-base-db",
        "con_project": "业务酬金稽核",
        "health_condition": "正常",
        "status": "运行中",
        "cpu": "1.0",
        "memory": "128MiB",
        "con_image": "ddaocloud.io/library/mysql<br/>5.5.0",
        "remark": "容器信息"
    }
];

/**
 * 虚拟网络数据
 * @type {*[]}
 */
var virtualnetworkdata  = [
    {
        "vn_code": "C301001",
        "segment_name": "金阳网段1",
        "ip_range": "172.18.0.10 ~ 172.18.0.100",
        "remark": "虚拟网络信息"
    },
    {
        "vn_code": "C301002",
        "segment_name": "金阳网段2",
        "ip_range": "172.18.1.10 ~ 172.18.1.100",
        "remark": "虚拟网络信息"
    }
];

/**
 * 负载均衡数据
 * @type {*[]}
 */
var loadlevelingdata  = [
    {
        "ll_code": "F301001",
        "public_ip": "117.135.196.139:18080",
        "ser_address": "10.201.253.114：5001</br>10.201.253.115：5002",
        "status": "正常",
        "remark": "虚拟网络信息"
    },
    {
        "ll_code": "F301002",
        "public_ip": "117.135.196.139:18081",
        "ser_address": "10.201.253.116：5001</br>10.201.253.117：5002",
        "status": "中断",
        "remark": "虚拟网络信息"
    }
];

/**
 * 集群管理数据
 * @type {*[]}
 */
var colonymanagedata  = [
    {
        "cm_code": "C301001",
        "cm_name": "测试集群",
        "usage": "CPU：20核（20%） </br>内存：500GB（50%）</br>磁盘：<font color='red'>40TB（80%）</font></br>带宽：60Mbps（60%）",
        "total_resource": "CPU： 100核</br> 内存： 1024 GB</br>磁盘： 50TB</br>带宽： 100Mbps",
        "status": "运行中",
        "remark": "金阳枢纽-301机房"
    },
    {
        "cm_code": "C301002",
        "cm_name": "正式集群",
        "usage": "CPU：20核（20%） </br>内存：500GB（50%）</br>磁盘：<font color='red'>40TB（80%）</font></br>带宽：60Mbps（60%）",
        "total_resource": "CPU： 100核</br> 内存： 1024 GB</br>磁盘：20TB</br>带宽： 10Mbps",
        "status": "故障",
        "remark": "虚拟机"
    }
];


/********************************************** TABLE HEAD ************************************************************************/

/**
 * 我的镜像表头
 * @type {*[]}
 */
var myimagecols = [[
    // {"field": "docker_code", checkbox:true},
    {"field": "jjj","title":"编号","width":80,align:"center","formatter":function (value, rowData,rowIndex) {
        return rowData.docker_code;
    }},
    {"field": "docker_resource","title":"镜像源","width":150,align:"center"},
    {"field": "versions","title":"版本","width":100,align:"center"},
    {"field": "createtime","title":"创建时间","width":100,align:"center"},
    {"field": "updatetime","title":"更新时间","width":80,align:"center"},
    {"field": "remark","title":"备注","width":200,align:"center"},
    {"field": "options","title":"操作","width":150,align:"center","formatter":function (value, rowData,rowIndex) {
        return "<a href='javascrip:void(0);'> 删除 </a>| <a href='javascrip:void(0);'>日志</a> ";
    }},
]];

/**
 * 收藏夹表头
 * @type {*[]}
 */
var myfavoritescols = [[
    // {"field": "docker_code", checkbox:true},
    {"field": "jjj","title":"编号","width":80,align:"center","formatter":function (value, rowData,rowIndex) {
        return rowData.docker_code;
    }},
    {"field": "docker_resource","title":"镜像源","width":150,align:"center"},
    {"field": "versions","title":"版本","width":100,align:"center"},
    {"field": "createtime","title":"创建时间","width":100,align:"center"},
    {"field": "updatetime","title":"更新时间","width":80,align:"center"},
    {"field": "remark","title":"备注","width":200,align:"center"},
    {"field": "options","title":"操作","width":150,align:"center","formatter":function (value, rowData,rowIndex) {
        return " 部署应用 ";
    }},
]];

/**
 * 服务管理表头
 * @type {*[]}
 */
var servicesMCols = [[
    // {"field": "service_code", checkbox:true},
    {"field": "jjj","title":"编号","width":80,align:"center","formatter":function (value, rowData,rowIndex) {
        return rowData.service_code;
    }},
    {"field": "service_name","title":"服务名称","width":150,align:"center"},
    {"field": "createtime","title":"开通时间","width":100,align:"center"},
    {"field": "status","title":"状态","width":100,align:"center"},
    {"field": "remark","title":"备注","width":200,align:"center"},
    {"field": "options","title":"操作","width":150,align:"center","formatter":function (value, rowData,rowIndex) {
        return " 详情 ";
    }},
]];

/**
 * 集群管理表头
 * @type {*[]}
 */
var colonymanagecols = [[
    {"field": "cm_code", checkbox:true},
    {"field": "jjj","title":"编号","width":80,align:"center","formatter":function (value, rowData,rowIndex) {
        return rowData.cm_code;
    }},
    {"field": "cm_name","title":"名称","width":100,align:"center"},
    {"field": "usage","title":"使用情况","width":150,align:"center"},
    {"field": "total_resource","title":"总资源","width":150,align:"center"},
    {"field": "status","title":"状态","width":100,align:"center","formatter":function (value, rowData,rowIndex) {
        if(value == '运行中'){
            return '<img src="/project/static/images/status1.png"  alt="" height="20px" width="20px" style="margin-right:1rem;">'+value;
        }else{
            return '<img src="/project/static/images/status2.png"  alt="" height="20px" width="20px" style="margin-right:1rem;">'+value;
        }

    }},
    {"field": "remark","title":"备注","width":200,align:"center"},
    {"field": "options","title":"操作","width":150,align:"center","formatter":function (value, rowData,rowIndex) {
        return ' 详情 | <span id="hm_list" style="cursor: pointer" onclick="hm_list(\''+rowData.cm_name+'\')">主机管理</span>';
    }},
]];