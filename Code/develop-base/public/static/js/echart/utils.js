/**
 * 生成echarts图表
 * 2015-10-20
 * cdl
 */

//折线颜色
var line_colors = ['#65BADE','#A1D5D0','#88C467','#A0D1A7','#E87366','#F7A56D','#F5CF68','#FFF803','#F4BDBA'];
//柱状图颜色
var column_colors = ['#d97a81','#8d99b3','#8599d4','#85cad4','#93d9b6','#d9b69e','#E87366', '#F7A56D', '#F5CF68'];
//饼图颜色
//var pie_colors = ['#65BADE','#A1D5D0','#88C467','#A0D1A7','#E87366','#F7A56D','#F5CF68','#FFF803','#F4BDBA','#A4BDBA'];
var pie_colors = ['#2ec7c9','#b7a3df','#5ab1ef','#ffb981','#d97a81','#8d99b3','#8599d4','#85cad4','#93d9b6','#d9b69e'];


/**
 * 根据传入的参数生成echarts图表
 * @param text 主标题
 * @param subtext 副标题
 * @param tipInfo tooltip显示样式
 * @param legendData 图例数据(数组)
 * @param xaxis 横坐标轴信息('category' | 'value' | 'time')
 * @param yaxis 纵坐标轴信息
 * @param series 显示数据
 * @param id
 * @returns
 */
function show_charts(id,text,subtext,tipInfo,legendData,xaxis,yaxis,series,line_colors,font_size){
    var option = {
        title : {
            text: text == null || text == '' ? null : text,
            subtext: subtext == null || subtext == '' ? '' : subtext,
            x:'center',
            textStyle:{
                fontSize: font_size,
                fontWeight: 'bolder',
                color: '#FFFFFF'
            }
        },
        tooltip : {
            trigger: 'axis',
            //formatter: tipInfo,
            axisPointer:{
                type: 'none'
            }
        },
        color : line_colors == null || line_colors == '' ? column_colors : line_colors,
        legend: {
            data:legendData == null || legendData == '' ? ['无数据'] : eval("("+legendData+")"),
            y:'bottom',
            textStyle:{
                color: '#FFFFFF'
            }
        },
        grid : {
            backgroundColor : 'rgba(0,0,0,1)',
            borderColor : '#000000'
        },
        toolbox: {
            show : false,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : false,
        xAxis : [
            {
                type : 'category',
                data : xaxis == null || xaxis == '' ? ['无数据'] : eval("("+xaxis+")"),
                splitLine : {show: false},
                axisLabel : {
                    textStyle :{
                        color: '#FFFFFF'
                    }
                }
            }
        ],
        yAxis : yaxis == null || yaxis == '' ? ['无数据'] : eval("("+yaxis+")"),
        series : series == null || series == '' ? [{name : '数据',data:[null]}] : eval("("+series+")")
    };
    create_chart(option,id);
}

/**
 * 根据传入的参数生成echarts图表(叠加柱状图)
 * @param text 主标题
 * @param subtext 副标题
 * @param tipInfo tooltip显示样式
 * @param legendData 图例数据(数组)
 * @param xaxis 横坐标轴信息('category' | 'value' | 'time')
 * @param yaxis 纵坐标轴信息
 * @param series 显示数据
 * @param id
 * @returns
 */
function show_stack_charts(id,legendData,xaxis,series,line_colors){
    var option = {
        backgroundColor: '#1B1C1E',
        grid : {
            x : 70,
            y : 70,
            x2 : 30,
            y2 : 50,
            backgroundColor: '#1B1C1E',
            borderColor: '#1B1C1E'
        },
        tooltip : {
            trigger: 'axis'
        },
        color : line_colors == null || line_colors == '' ? column_colors : line_colors,
        legend: {
            data:legendData == null || legendData == '' ? ['无数据'] : eval("("+legendData+")"),
            textStyle:{
                color: '#FFFFFF'
            }
        },
        calculable : false,
        xAxis : [
            {
                type : 'category',
                data : xaxis == null || xaxis == '' ? ['无数据'] : eval("("+xaxis+")"),
                splitLine : {show: false},
                axisLabel : {
                    textStyle :{
                        color: '#F7F0F0'
                    }
                },
                splitArea : {show : false}
            }
        ],
        yAxis : [
            {
                splitLine:{show:false},
                type : 'value',
                axisLabel: {
                    textStyle: {
                        color: '#F7F0F0'
                    }
                },
                splitArea : {show : false}
            }
        ],
        series : series == null || series == '' ? [{name : '数据',data:[null]}] : eval("("+series+")")
    };
    create_chart(option,id);
}

/**
 * 根据传入的参数生成echarts图表(线性图)
 * @param text 主标题
 * @param subtext 副标题
 * @param tipInfo tooltip显示样式
 * @param legendData 图例数据(数组)
 * @param xaxis 横坐标轴信息('category' | 'value' | 'time')
 * @param yaxis 纵坐标轴信息
 * @param series 显示数据
 * @param id
 * @returns
 */
function show_line_charts(id,legendData,xaxis,series,line_colors){
    var option = {
        backgroundColor: '#1B1C1E',
        grid : {
            x : 70,
            y : 70,
            x2 : 30,
            y2 : 50,
            backgroundColor: '#1B1C1E',
            borderColor: '#1B1C1E'
        },
        tooltip : {
            trigger: 'axis',
            formatter: function(params){
                if(params == null || params == '' || params.length == 0) {
                    return '';
                }
                var s = '';
                for (var i in params) {
                    s += params[i].seriesName;
                    s += ' : ';
                    s += params[0].value == '' || params[0].value == undefined ? 0:params[0].value;
                    s += '笔<br/>';
                }
                return s;
                /*return params[0].name+ '<br/>'+
                 params[0].seriesName +' : '+ (params[0].value == '' || params[0].value == undefined ? 0:params[0].value) +'笔' + '<br/>'+
                 params[1].seriesName +' : '+ (params[1].value == '' || params[1].value == undefined ? 0:params[1].value) +'笔';*/
            }
        },
        color : line_colors == null || line_colors == '' ? column_colors : line_colors,
        legend: {
            data:legendData == null || legendData == '' ? ['无数据'] : eval("("+legendData+")"),
            textStyle:{
                color: '#FFFFFF'
            }
        },
        calculable : false,
        xAxis : [
            {
                type : 'category',
                data : xaxis == null || xaxis == '' ? ['无数据'] : eval("("+xaxis+")"),
                splitLine : {show: false},
                boundaryGap : true,
                axisLabel : {
                    textStyle :{
                        color: '#F7F0F0'
                    }
                },
                splitArea : {show : false}
            }
        ],
        yAxis : [
            {
                splitLine:{show:false},
                type : 'value',
                axisLabel: {
                    textStyle: {
                        color: '#F7F0F0'
                    }
                },
                splitArea : {show : false}
            }
        ],
        series : series == null || series == '' ? [{name : '数据',data:[null]}] : eval("("+series+")")
    };
    create_chart(option,id);
}

/**
 * 根据传入的参数生成echarts图表(条形图)
 * @param text 主标题
 * @param subtext 副标题
 * @param tipInfo tooltip显示样式
 * @param legendData 图例数据(数组)
 * @param xaxis 横坐标轴信息('category' | 'value' | 'time')
 * @param yaxis 纵坐标轴信息
 * @param series 显示数据
 * @param id
 * @returns
 */
function show_bartype(id,text,subtext,tipInfo,legendData,xaxis,yaxis,series,colors,font_size){
    var option = {
        title : {
            text: text == null || text == '' ? null : text,
            subtext: subtext == null || subtext == '' ? '' : subtext,
            x:'center',
            textStyle:{
                fontSize: font_size,
                fontWeight: 'bolder',
                color: '#FFFFFF'
            }
        },
        tooltip : {
            trigger: 'axis',
            //formatter: tipInfo,
            axisPointer:{
                type: 'none'
            }
        },
        color : colors == null || colors == '' ? column_colors : colors,
        legend: {
            data:legendData == null || legendData == '' ? ['无数据'] : eval("("+legendData+")"),
            y:'bottom',
            textStyle:{
                color: '#FFFFFF'
            }
        },
        grid : {
            backgroundColor : 'rgba(0,0,0,1)',
            borderColor : '#000000'
        },
        toolbox: {
            show : false,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : false,
        yAxis : [
            {
                type : 'category',
                data : xaxis == null || xaxis == '' ? ['无数据'] : eval("("+xaxis+")"),
                splitLine : {show: false},
                axisLabel : {
                    textStyle :{
                        color: '#FFFFFF'
                    }
                }
            }
        ],
        xAxis : yaxis == null || yaxis == '' ? ['无数据'] : eval("("+yaxis+")"),
        series : series == null || series == '' ? [{name : '数据',data:[null]}] : eval("("+series+")")
    };
    create_chart(option,id);
}

/**
 * 根据传入的参数生成echarts图表(饼图)
 * @param text 主标题
 * @param subtext 副标题
 * @param tipInfo tooltip显示样式
 * @param legendData 图例数据(数组)
 * @param series 显示数据
 * @param id
 * @returns
 */
function show_pie(id,text,subtext,legendData,series,colors,font_size,x,y){
    var option = {
        backgroundColor: '#1B1C1E',
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)",
            axisPointer:{
                type: 'none'
            }
        },
        color : colors == null || colors == '' ? pie_colors : colors,
        legend: {
            data:legendData == null || legendData == '' ? ['无数据'] : eval("("+legendData+")"),
            textStyle:{
                color: '#FFFFFF'
            },
            orient : 'vertical',
            x : 'left'
        },
        calculable : false,
        series : [
            {
                name:'',
                type:'pie',
                radius : '55%',//通过该属性可变化环形(radius : ['50%', '70%'])和饼图 (radius : '55%')
                itemStyle : {
                    normal : {
                        label : {
                            show : true,
                            formatter: "{b}\n{c}笔"
                        },
                        labelLine : {
                            show : true
                        }
                    },
                    emphasis : {
                        label : {
                            show : true,
                            position : 'center',
                            textStyle : {
                                fontWeight : 'bold'
                            }
                        }
                    }
                },
                center: [x,y],
                data : series == null || series == '' ? [['无数据',null]] : eval(series)
            }
        ]
    };
    create_chart(option,id);
}

/**
 * 根据传入的参数生成echarts图表(柱状图)
 * @param text 主标题
 * @param subtext 副标题
 * @param tipInfo tooltip显示样式
 * @param legendData 图例数据(数组)
 * @param series 显示数据
 * @param id
 * @returns
 */
function show_line(id,text,subtext,legendData,xAxis,series,colors,font_size){
    var option = {
        backgroundColor: '#1B1C1E',
        grid : {
            x : 70,
            y : 20,
            x2 : 30,
            y2 : 60,
            backgroundColor: '#1B1C1E',
            borderColor: '#1B1C1E'
        },
        tooltip : {
            trigger: 'axis'/*,
             formatter: function(params){
             return params[0].name+ '<br/>'+
             params[0].seriesName +' : '+ (params[0].value == '' || params[0].value == undefined ? 0:params[0].value) +'笔' + '<br/>'+
             params[1].seriesName +' : '+ (params[1].value == '' || params[1].value == undefined ? 0:params[1].value) +'笔';
             }*/
        },
        color : colors == null || colors == '' ? pie_colors : colors,
        legend: {
            data:legendData == null || legendData == '' ? ['无数据'] : eval("("+legendData+")"),
            textStyle:{
                color: '#FFFFFF'
            }
        },
        calculable : false,
        xAxis : [{
            type : 'category',
            splitLine:{show:false},
            axisLabel: {
                interval : 0,
                rotate:-20,
                textStyle: {
                    color: '#FFFFFF'
                }
            },
            data : xAxis == null || xAxis == '' ? ['无数据'] : eval("("+xAxis+")"),
            splitArea : {show : false}
        }
        ],
        yAxis : [
            {
                splitLine:{show:false},
                type : 'value',
                axisLabel: {
                    textStyle: {
                        color: '#FFFFFF'
                    }
                },
                splitArea : {show : false}
            }
        ],
        series : series == null || series == '' ? [{name : '数据',data:[null]}] : eval("("+series+")")
    };
    create_chart(option,id);
}


/**
 * 根据传入的参数生成echarts图表(多个饼图1)
 * @param text 主标题
 * @param subtext 副标题
 * @param tipInfo tooltip显示样式
 * @param legendData 图例数据(数组)
 * @param series 显示数据
 * @param id
 * @returns
 */
function show_y_pie(id,text,subtext,legendData,series,colors){
    var option = {
        backgroundColor: '#1B1C1E',
        /*tooltip : {
         trigger: 'axis'
         },*/
        tooltip : {
            trigger: 'item',
            formatter: "{c} 笔({d}%)"
        },
        color : colors == null || colors == '' ? pie_colors : colors,
        legend: {
            x : 'center',
            y : 'bottom',
            data:legendData == null || legendData == '' ? ['无数据'] : eval("("+legendData+")"),
            textStyle:{
                color: '#FFFFFF'
            }
        },
        series : series == null || series == '' ? [{name : '数据',data:[null]}] : eval("("+series+")")
    };
    create_chart(option,id);
}

/**
 * 根据传入的参数生成echarts图表(多个饼图2)
 * @param text 主标题
 * @param subtext 副标题
 * @param tipInfo tooltip显示样式
 * @param legendData 图例数据(数组)
 * @param series 显示数据
 * @param id
 * @returns
 */
function show_product_pie(id,text,subtext,legendData,series,colors){
    var option = {
        backgroundColor: '#1B1C1E',
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color : colors == null || colors == '' ? pie_colors : colors,
        legend: {
            orient : 'vertical',
            x : 'left',
            data:legendData == null || legendData == '' ? ['无数据'] : eval("("+legendData+")"),
            textStyle:{
                color: '#FFFFFF'
            }
        },
        calculable : false,
        series : series == null || series == '' ? [{name : '数据',data:[null]}] : eval("("+series+")")
    };
    create_chart(option,id);
}

/**
 * 根据传入的参数生成echarts图表(搭配时间轴的饼图)
 * @param text 主标题
 * @param subtext 副标题
 * @param timeData 时间轴数据
 * @param legendData 图例数据(数组)
 * @param series 显示数据
 * @param id
 * @returns
 */
function show_time_pie(id,text,subtext,timeData,legendData,series,colors,font_size){
    var option = {
        timeline : {
            data:timeData == null || timeData == '' ? ['无数据'] : eval("("+timeData+")"),
            label : {
                formatter : function(s) {
                    return s.slice(0, 7);
                }
            }
        },
        options : [
            {
                title : {
                    text: text == null || text == '' ? null : text,
                    subtext: subtext == null || subtext == '' ? '' : subtext,
                    x:'center',
                    textStyle:{
                        fontSize: font_size,
                        fontWeight: 'bolder',
                        color: '#FFFFFF'
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{b} : {c} ({d}%)",
                    axisPointer:{
                        type: 'none'
                    }
                },
                color : colors == null || colors == '' ? pie_colors : colors,
                legend: {
                    data:legendData == null || legendData == '' ? ['无数据'] : eval("("+legendData+")"),
                    y:'bottom',
                    textStyle:{
                        color: '#FFFFFF'
                    }
                },
                grid : {
                    backgroundColor : 'rgba(0,0,0,1)',
                    borderColor : '#000000'
                },
                toolbox: {
                    show : false,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : false,
                series : [
                    {
                        name:'',
                        type:'pie',
                        radius : '55%',//通过该属性可变化环形(radius : ['50%', '70%'])和饼图 (radius : '55%')
                        center: ['50%', '60%'],
                        data : series == null || series == '' ? [['无数据',null]] : eval("["+series+"]")
                    }
                ]
            },
            {
                series : [
                    {
                        name:'',
                        type:'pie',
                        data : series == null || series == '' ? [['无数据',null]] : eval("["+series+"]")
                    }
                ]
            },
            {
                series : [
                    {
                        name:'',
                        type:'pie',
                        data : series == null || series == '' ? [['无数据',null]] : eval("["+series+"]")
                    }
                ]
            }
        ]
    };




    var option = {

    };
    create_chart(option,id);
}


/**
 * 根据传入的参数生成echarts图表(搭配时间轴的混合图)
 * @param text 主标题
 * @param subtext 副标题
 * @param tipInfo tooltip显示样式
 * @param legendData 图例数据(数组)
 * @param xaxis 横坐标轴信息('category' | 'value' | 'time')
 * @param yaxis 纵坐标轴信息
 * @param series 显示数据
 * @param id
 * @param dateData 时间轴数据
 * @returns
 */
function show_timecharts(id,dateData,text,subtext,tipInfo,legendData,xaxis,yaxis,series,line_colors,font_size){
    var option = {
        timeline:{
            data:dateData == null || dateData == '' ? ['无数据'] : eval("("+dateData+")"),
            label : {
                formatter : function(s) {
                    return s.slice(0, 4);
                }
            },
            autoPlay : true,
            playInterval : 1000
        },
        options:[{
            title : {
                text: text == null || text == '' ? null : text,
                subtext: subtext == null || subtext == '' ? '' : subtext,
                x:'center',
                textStyle:{
                    fontSize: font_size,
                    fontWeight: 'bolder',
                    color: '#FFFFFF'
                }
            },
            tooltip : {
                trigger: 'axis',
                //formatter: tipInfo,
                axisPointer:{
                    type: 'none'
                }
            },
            color : line_colors == null || line_colors == '' ? column_colors : line_colors,
            legend: {
                data:legendData == null || legendData == '' ? ['无数据'] : eval("("+legendData+")"),
                y:'bottom',
                textStyle:{
                    color: '#FFFFFF'
                }
            },
            grid : {
                y : 80,
                y2 : 100,
                backgroundColor : 'rgba(0,0,0,1)',
                borderColor : '#000000'
            },
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : false,
            xAxis : [
                {
                    type : 'category',
                    data : xaxis == null || xaxis == '' ? ['无数据'] : eval("("+xaxis+")"),
                    splitLine : {show: false},
                    axisLabel : {
                        interval : 0,//标签显示挑选间隔，默认为'auto'，可选为：'auto'（自动隐藏显示不下的） | 0（全部显示） |{number}（用户指定选择间隔）
                        textStyle :{
                            color: '#FFFFFF'
                        }
                    }
                }
            ],
            yAxis : yaxis == null || yaxis == '' ? ['无数据'] : eval("("+yaxis+")"),
            series : series == null || series == '' ? [{name : '数据',data:[null]}] : eval("("+series+")")
        }
        ]
    };
    create_chart(option,id);
}


/**
 * 根据传入的参数生成echarts图表(半饼图)
 * @param text 主标题
 * @param subtext 副标题
 * @param tipInfo tooltip显示样式
 * @param legendData 图例数据(数组)
 * @param xaxis 横坐标轴信息('category' | 'value' | 'time')
 * @param yaxis 纵坐标轴信息
 * @param series 显示数据
 * @param id
 * @param dateData 时间轴数据
 * @returns
 */
function show_halfpiecharts(id,text,subtext,legendData,series,colors,font_size,legend_x,legend_y){
    /*var dataStyle = {
     normal: {
     label: {show:false},
     labelLine: {show:false}
     }
     };
     var placeHolderStyle = {
     normal : {
     color: 'rgba(0,0,0,0)',
     label: {show:false},
     labelLine: {show:false}
     },
     emphasis : {
     color: 'rgba(0,0,0,0)'
     }
     };*/
    var option = {
        backgroundColor : '#1B1C1E',
        color : colors == null || colors == '' ? pie_colors : colors,
        title: {
            text: text,
            x: 'center',
            y: 'center',
            itemGap: 20,
            textStyle : {
                color : '#c0ffff',
                fontFamily : '微软雅黑',
                fontSize : 35,
                fontWeight : 'bolder'
            },
            subtext: subtext,
            subtextStyle : {
                color : '#c0ffff',
                fontFamily : '微软雅黑',
                fontSize : 15,
                fontWeight : 'bolder'
            }
        },
        tooltip : {
            show: true,
            formatter: "{a} <br/>{b}({d}%)"
        },
        legend: {
            orient : 'vertical',
            x : legend_x,
            y : legend_y,
            itemGap:12,
            textStyle : {
                color: '#FFF'
            },
            data:legendData == null || legendData == '' ? ['无数据'] : eval("("+legendData+")")
        },
        toolbox: {
            show : false,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        series : series == null || series == '' ? [{name : '数据',data:[null]}] : eval("("+series+")")
    };

    create_chart(option,id);
}

//创建动态的bar和line混合图标
function show_leveles_charts(id,xaxis,yaxis,series,legendData,colors,x,y,x2,y2){
    var option = {
        backgroundColor : '#1B1C1E',
        tooltip : {
            trigger: 'axis'
        },
        color : colors == null || colors == '' ? column_colors : colors,
        grid : {
            x : x,
            y : y,
            x2 : x2,
            y2 : y2,
            backgroundColor : '#1B1C1E',
            borderColor: '#1B1C1E'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:legendData == null || legendData == '' ? ['无数据'] : eval("("+legendData+")"),
            y : 'bottom',
            /*y :210,*/
            textStyle : {
                color: '#FFF'
            }
        },
        xAxis : [
            {
                type : 'category',
                splitLine:{show:false},
                axisLabel : {
                    interval:0,
                    textStyle : {color: '#FFF'}
                },
                data : xaxis == null || xaxis == '' ? ['无数据'] : eval("("+xaxis+")"),
                splitArea : {
                    show : false
                }
            }
        ],
        yAxis : yaxis == null || yaxis == '' ? ['无数据'] : eval("("+yaxis+")"),
        series : series == null || series == '' ? [{name : '数据',data:[null]}] : eval("("+series+")")
    };
    create_chart(option,id);
    /*create_dynamic_chart(option,id);*/
}

//创建动态的bar和line混合图标
function show_level_charts(id,xaxis,yaxis,series,legendData,colors,x,y,x2,y2){
    var option = {
        backgroundColor : '#1B1C1E',
        tooltip : {
            trigger: 'axis'
        },
        color : colors == null || colors == '' ? column_colors : colors,
        grid : {
            x : x,
            y : y,
            x2 : x2,
            y2 : y2,
            backgroundColor : '#1B1C1E',
            borderColor: '#1B1C1E'
        },
        tooltip : {
            trigger: 'axis',
            formatter: function(params){
                return params[0].name+ '<br/>'+
                    params[0].seriesName +' : '+ (params[0].value == '' || params[0].value == undefined ? 0:params[0].value) +'%' + '<br/>'+
                    params[1].seriesName +' : '+ (params[1].value == '' || params[1].value == undefined ? 0:params[1].value) +'%';
            }
        },
        legend: {
            data:legendData == null || legendData == '' ? ['无数据'] : eval("("+legendData+")"),
            y : 'bottom',
            /*y :210,*/
            textStyle : {
                color: '#FFF'
            }
        },
        xAxis : [
            {
                type : 'category',
                splitLine:{show:false},
                axisLabel : {
                    'interval':0,
                    textStyle : {color: '#FFF'}
                },
                data : xaxis == null || xaxis == '' ? ['无数据'] : eval("("+xaxis+")"),
                splitArea : {
                    show : false
                }
            }
        ],
        yAxis : yaxis == null || yaxis == '' ? ['无数据'] : eval("("+yaxis+")"),
        series : series == null || series == '' ? [{name : '数据',data:[null]}] : eval("("+series+")")
    };
    create_chart(option,id);
    /*create_dynamic_chart(option,id);*/
}

//创建带时间轴的动态line和bar图标
function show_timer_shaft_charts(id,xaxis,yaxis,series,legendData,colors){
    var option = {
        color : colors == null || colors == '' ? column_colors : colors,
        backgroundColor : '#1B1C1E',
        grid : {
            x : 70,
            y : 10,
            x2 : 50,
            y2 : 80,
            backgroundColor : '#1B1C1E',
            borderColor : '#1B1C1E'
        },
        tooltip : {
            trigger: 'axis',
            formatter: function(params){
                return params[0].name+ '<br/>'+
                    params[0].seriesName +' : '+ (params[0].value == '' || params[0].value == undefined ? 0:params[0].value) +'' + '<br/>'+
                    params[1].seriesName +' : '+ (params[1].value == '' || params[1].value == undefined ? 0:params[1].value) +'' + '<br/>'+
                    params[2].seriesName +' : '+ (params[2].value == '' || params[2].value == undefined ? 0:params[2].value) +'' + '<br/>'+
                    params[3].seriesName +' : '+ (params[3].value == '' || params[3].value == undefined ? 0:params[3].value) +'' + '<br/>'+
                    params[4].seriesName +' : '+ (params[4].value == '' || params[4].value == undefined ? 0:params[4].value) +'%' + '<br/>'+
                    params[5].seriesName +' : '+ (params[5].value == '' || params[5].value == undefined ? 0:params[5].value) +'%';
            }
        },
        dataZoom: {
            show: true,
            start : 0,
            end : 100
        },
        legend: {
            data : legendData == null || legendData == '' ? ['暂无数据'] : eval("("+legendData+")"),
            y : 'bottom',
            y : 210,
            textStyle : {
                color: '#FFF'
            }
        },
        xAxis : [
            {
                type : 'category',
                data : xaxis == null || xaxis == '' ? ['暂无数据'] : eval("("+xaxis+")"),
                splitLine:{show:false},
                axisLabel : {
                    textStyle : {color: '#FFF'}
                },
                splitArea : {
                    show : false
                }
            }
        ],
        yAxis : [
            {
                type : 'value',
                //name : '数量',
                splitLine:{show:false},
                axisLabel : {
                    textStyle : {color: '#FFF'}
                },
                splitArea : {
                    show : false
                }
            },
            {
                type : 'value',
                //name : '百分比',
                axisLabel : {
                    formatter: '{value} %',
                    textStyle : {color: '#FFF'}
                },
                splitLine:{show:false},
                splitArea : {
                    show : false
                }
            }
        ],
        series : series == null || series == '' ? [{name : '数据',data:[null]}] : eval("("+series+")")
    };
    create_chart(option,id);
    /*create_dynamic_chart(option,id);*/
}

//创建组合全饼图
function show_pie_charts(id,text,subtext,legendData,series,colors,font_size,legend_x,legend_y){
    var option = {
        backgroundColor : '#1B1C1E',
        color : colors == null || colors == '' ? pie_colors : colors,
        title: {
            text: text,
            x: 'center',
            y: 'center',
            itemGap: 20,
            textStyle : {
                color : '#c0ffff',
                fontFamily : '微软雅黑',
                fontSize : 35,
                fontWeight : 'bolder'
            },
            subtext: subtext,
            subtextStyle : {
                color : '#c0ffff',
                fontFamily : '微软雅黑',
                fontSize : 15,
                fontWeight : 'bolder'
            }
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} ({d}%)"
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            itemGap:12,
            textStyle : {
                color: '#FFF'
            },
            data:legendData == null || legendData == '' ? ['无数据'] : eval("("+legendData+")")
        },
        calculable : false,
        series : [
            {
                name:'',
                type:'pie',
                radius : ['70%', '90%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        labelLine : {
                            show : false
                        }
                    }
                },
                data : series == null || series == '' ? [null] : eval("("+series+")")
            }
        ]
    };
    create_chart(option,id);
}

//根据参数生成图标
function create_chart(option,id) {
    var myChart = echarts.init(document.getElementById(id));
    myChart.setOption(option);
    /*require(
     [
     'echarts',
     'echarts/chart/line', // 使用线性图就加载line模块，按需加载
     'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
     'echarts/chart/radar',
     'echarts/chart/pie'
     ],
     function (ec) {
     // 基于准备好的dom，初始化echarts图表
     myChart = ec.init(document.getElementById(id));

     // 为echarts对象加载数据
     myChart.setOption(option);
     }
     );*/
}
//生成动态的图表
function create_dynamic_chart(option,id){
    /*require(
     [
     'echarts',
     'echarts/chart/line', // 使用柱状图就加载bar模块，按需加载
     'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
     'echarts/chart/pie'
     ],
     function (ec) {
     // 基于准备好的dom，初始化echarts图表
     myChart = ec.init(document.getElementById(id));

     // 为echarts对象加载数据
     myChart.setOption(option);

     //自动切换
     autoShowTip();

     setInterval(function (){
     if (index == length) {
     index = 0;
     }
     myChart.component.tooltip.showTip({seriesIndex:0,dataIndex:index});
     index++;
     }, 1000);

     }
     );*/
}