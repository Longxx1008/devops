var nodeGrass=require("nodegrass");

var csv=require("csv");

/**
 * csv插件获取haproxy服务发现数据
 */
function getHaproxy() {
    var arr=[]
    var arrr=[]
    var arrs=[]
    var narr=[];
    var result={}
    nodeGrass.get('http://192.168.9.61:9090/haproxy?stats;csv', function(data){
        csv.parse(data, function(err, data){
            csv.transform(data, function(data){
                if(data[0]=='develop-base_develop-base-09-28_10003'){
                    arr.push(data[0]);
                }
                arrs.push(data[1])
            }, function(err, data){
                for(var i=13;i<arr.length+11;i++){
                    narr.push(arrs[i]);
                }
                for(var i=0;i<narr.length;i++){
                    arrr.push('develop-base_develop-base-09-28_10003');
                }
                result.name=arrr
                result.value=narr
                console.log(result.name);
                console.log(result.value);
                csv.stringify(data, function(err, data){
                    process.stdout.write(data);
                });
            });
        });
    })
}
getHaproxy()
