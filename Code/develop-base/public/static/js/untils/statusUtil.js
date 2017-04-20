/**
 * Created by Andrew on 2016/3/17.
 */
var statusArray=[
    {
        code:'100',
        value:'正常',
        color:'green'
    }, {
        code:'101',
        value:'停用',
        color:'red'
    }, {
        code:'200',
        value:'正在推流',
        color:'green'
    }
]

/**
 * 格式化状态
 **/
function statusFormat(data,rowData,rowIndex) {
    var sReturn = '<font color=\'red\' >未知</font>';

    $(statusArray).each(function (i,item) {

        var flag=false;
        if(item.code==data){
            sReturn="<font color='"+item.color+"' >"+item.value+"</font>";
            flag=true;
        }

        if(flag) return false;
    });

    return sReturn;
}