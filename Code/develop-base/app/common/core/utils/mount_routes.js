var fs     = require('fs');
var requireDirectory = require('require-directory');
var routes = requireDirectory(module, '../routes');
var apputils = require('./app_utils');
var config = require('../../../../config');

var mount_path = config.routes.mount_path;
var mappings = config.routes.mappings;

var stack = [];
/**
 * Mount routes with directory.
 *
 * Examples:
 *
 *     // mount routes in app.js
 *     require('./config/routes')(app);
 *
 * @param {Object} app
 * @param {Object} routes
 * @param {String} pre
 * @return 
 * @api public
 */
function mount(app) {
  var r = arguments[1] || routes;
  var pre = arguments[2] || '';
  
  for (var k in r) {
    var file = '/' + pre + '' + k + '.js';
    // console.log('mount route ' + file + " ");
    var path = '';
    if(typeof r[k] == 'object') {
      // console.log('this is a obj');
      mount(app, r[k], pre + k + '/');
    }else if(k === 'index') {
      path = '/'+ pre;
      //_use(app, file, path, r[k]);
      _use(app, file, path, r[k], '');
    }else {
      path = '/' + pre + '' + k;
      //console.log(pre);
     // _use(app, file, path, r[k]);
      _use(app, file, '/' + pre, r[k], k);
    }
  }
}

function _use(app, file, path, handler, suffixPath) {
  // console.dir(handler)
  //console.dir(config.routes.mount_path);
  // console.log(handler.stack)
  //console.log(/^[\w]+[\/routes\/][\w]+$/.test(path));
  //console.log(path+'--------'+apputils.wildcard('*/routes/*', path));
  //console.log(path + suffixPath);
  //console.log(app.locals.config.routes.mount_path);

  if(apputils.wildcard(mount_path, path)) {

    if(mappings[path]) {
      var newPath = mappings[path] + suffixPath;

      app.use(newPath, handler);

      _track_routes(file, newPath, handler.stack);
      //app.use(path, handler);
      //_track_routes(file, path, handler.stack);
    }
  }
}

function _track_routes(file, path, handle) {
  for(var i in handle){
    var _route = handle[i].route;
    // console.log(_route);
    // console.log(_route.stack);
    // console.log(_route.methods);
    var params = _route.stack.params;
    
    for(var j in _route.methods){
      if(_route.path == '/'){
        _cache_to_stack(file, path, j);
      }else{
        if(path == '/') {
          _cache_to_stack(file, _route.path, j);
        }
        else {
          _cache_to_stack(file, path + _route.path, j);
        }
      }
    }
  }
}

function _cache_to_stack(file, path, method) {
  // console.log(file+ ' ' +method + ' ' + path)
  stack.push({
    file    : file,
    method  : method,
    path    : path
  });
}

function _dump(routes_folder_path) {
  var Table = require('cli-table');
  var table = new Table({ head: ["File", "Method", "Path"] });

  // console.log(stack)
  console.log('\n******************************************************');
  console.log('\t\tMoaJS Apis Dump');
  console.log('******************************************************\n');
  
  for (var k in stack) {
    var obj = stack[k];
    // console.dir(k)
    // console.log(obj.file + obj.method + obj.path)
    table.push(
        [routes_folder_path + obj.file, obj.method, obj.path]
    );
  }
  console.log(table.toString());
}

/**
 * Mount routes with directory.
 *
 * Examples:
 *
 *     // mount routes in app.js
 *     mount(app, 'routes2', true);
 *
 * @param {Object} app
 * @param {String} routes_folder_path
 * @param {Boolean} is_debug
 * @return 
 * @api public
 */
function mount_with_folder(app, routes_folder_path) {
  stack = [];// empty when enter
  
  var r         = arguments[1] || './routes';
  var is_debug  = arguments[2] || false;
  
  // console.log('mount routes_folder_path = ' + r)
  routes = requireDirectory(module, r, {extensions: ['js']});
  
  mount(app) ;
  
  if(is_debug){
    _dump (routes_folder_path);
  }
}

module.exports = mount_with_folder;