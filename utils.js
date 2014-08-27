// Se definen todos los componentes que se requiren para poder ejecutar la aplicacion
var chalk           = require('chalk');
var fs              = require('fs');
var ngParseModule   = require('ng-parse-module');
var path            = require('path');
var _               = require('underscore');
_.str               = require('underscore.string');
_.mixin(_.str.exports());

// Se definen las secciones donde se inyectaran los componentes que se iran creando de manera automatica en el proyecto
exports.JS_MARKER       = "<!-- Add New Component JS Above -->";
exports.LESS_MARKER     = "/* Add Component LESS Above */";
exports.ROUTE_MARKER    = "/* Add New Routes Above */";
exports.STATE_MARKER    = "/* Add New States Above */";

// Se define la funcion que genera un archivo a traves de los comandos del generador
exports.addToFile = function(filename, lineToAdd, beforeMarker) {
	try {
		var fullPath    = path.resolve(process.cwd(), filename);
		var fileSrc     = fs.readFileSync(fullPath, 'utf8');
		var indexOf     = fileSrc.indexOf(beforeMarker);
        var lineStart   = fileSrc.substring(0, indexOf).lastIndexOf('\n') + 1;
        var indent      = fileSrc.substring(lineStart, indexOf);
		    fileSrc     = fileSrc.substring(0, indexOf) + lineToAdd + "\n" + indent + fileSrc.substring(indexOf);
		fs.writeFileSync(fullPath, fileSrc);
	} catch(e) {
		throw e;
	}
};

// Se define la funcion que realiza el procesamiento de las plantillas
exports.processTemplates = function(name, dir, type, that, defaultDir, configName, module) {
    if (!defaultDir) {
        defaultDir  = 'templates'
    }
    if (!configName) {
        configName  = type + 'Templates';
    }
    var templateDirectory   = path.join(path.dirname(that.resolved), defaultDir);
    if (that.config.get(configName)) {
        templateDirectory   = path.join(process.cwd(), that.config.get(configName));
    }
    _.chain(fs.readdirSync(templateDirectory))
        .filter(function(template) {
            return template[0] !== '.';
        })
        .each(function(template) {
            var customTemplateName  = template.replace(type, name);
            var templateFile        = path.join(templateDirectory, template);
            // Se crea el archivo de referencia
            that.template(templateFile, path.join(dir, customTemplateName));
            // Se inyecta la referencia del archivo en index.html, app.less o en otro archivo segun corresponda
            exports.inject(path.join(dir, customTemplateName), that, module);
        });
};

// Se define la funcion que inyecta el codigo en los archivos
exports.inject = function(filename, that, module) {
    // Se define el caso especial para omitir las pruebas unitarias
    if (_(filename).endsWith('-spec.js') || _(filename).endsWith('_spec.js') || _(filename).endsWith('-test.js') || _(filename).endsWith('_test.js')) {
        return;
    }
    var ext = path.extname(filename);
    if (ext[0] === '.') {
        ext = ext.substring(1);
    }
    var config  = that.config.get('inject')[ext];
    if (config) {
        var configFile      = _.template(config.file)({module:path.basename(module.file, '.js')});
        var injectFileRef   = filename;
        if (config.relativeToModule) {
            configFile      = path.join(path.dirname(module.file), configFile);
            injectFileRef   = path.relative(path.dirname(module.file), filename);
        }
            injectFileRef   = injectFileRef.replace(/\\/g,'/');
        var lineTemplate    = _.template(config.template)({filename:injectFileRef});
        exports.addToFile(configFile, lineTemplate, config.marker);
        that.log.writeln(chalk.green(' updating') + ' %s', path.basename(configFile));
    }
};

// Se define la funcion que inyecta las rutas de la aplicacion en el archivo general
exports.injectRoute = function(moduleFile, uirouter, name, route, routeUrl, that){
    routeUrl = routeUrl.replace(/\\/g, '/');
    if (uirouter) {
        var code    = '$stateProvider.state(\'' + name + '\', {\n url: \'' + route + '\', \n templateUrl: \'' + routeUrl + '\'\n });';
        exports.addToFile(moduleFile, code, exports.STATE_MARKER);
    } else {
        exports.addToFile(moduleFile, '$routeProvider.when(\'' + route + '\', {templateUrl: \'' + routeUrl + '\'});', exports.ROUTE_MARKER);
    }
    that.log.writeln(chalk.green(' updating') + ' %s', path.basename(moduleFile));
};

// Se define la funcion que retorna el listado de modulos a partir de un directorio definido
exports.getParentModule = function(dir) {
    if (fs.existsSync(dir)) {
        var files   = fs.readdirSync(dir);
        for (var i = 0; i < files.length; i++) {
            if (path.extname(files[i]) !== '.js') {
                continue;
            }
            var results = ngParseModule.parse(path.join(dir, files[i]));
            if (results) {
                return results;
            }
        }
    }
    // Se verifica si es que estamos en la raiz del proyecto
    if (fs.existsSync(path.join(dir, '.yo-rc.json'))) {
        return;
    }
    return exports.getParentModule(path.join(dir, '..'));
};

// Se define la generacion del modulo
exports.askForModule = function(type ,that, cb) {
    var modules         = that.config.get('modules');
    var mainModule      = ngParseModule.parse('app.js');
    mainModule.primary  = true;
    if (!modules || modules.length === 0) {
        cb.bind(that)(mainModule);
        return;
    }
    var choices         = _.pluck(modules,'name');
    choices.unshift(mainModule.name + ' (Módulo primario de la aplicación)');
    var prompts         = [
        {
            name:       'module',
            message:    '¿Qué módulo le gustaría colocar para el nuevo ' + type + '?',
            type:       'list',
            choices:    choices,
            default:    0
        }
    ];
    that.prompt(prompts, function (props) {
        var i   = choices.indexOf(props.module);
        var module;
        if (i === 0) {
            module  = mainModule;
        } else {
            module  = ngParseModule.parse(modules[i-1].file);
        }
        cb.bind(that)(module);
    }.bind(that));
};

// Se define la funcion que genera un directorio propio
exports.askForDir = function(type, that, module, ownDir, cb) {
    that.module     = module;
    that.appname    = module.name;
    that.dir        = path.dirname(module.file);
    var configedDir = that.config.get(type + 'Directory');
    if (!configedDir) {
        configedDir = '.';
    }
    var defaultDir  = path.join(that.dir,configedDir, '/');
        defaultDir  = path.relative(process.cwd(), defaultDir);
    if (ownDir) {
        defaultDir  = path.join(defaultDir, that.name);
    }
        defaultDir  = path.join(defaultDir, '/');
    var dirPrompt   = [
        {
            name:       'dir',
            message:    '¿Donde le gustaría crear los archivos de ' + type + '?',
            default:    defaultDir,
            validate:   function(dir){
                if (!module.primary) {
                    dir = path.resolve(dir);
                    if (path.relative(that.dir, dir).substring(0, 2) === '..') {
                        return 'Los archivos deben ser colocados dentro del directorio del módulo o en un subdirectorio del módulo'
                    }
                }
                return true;
            }
        }
    ];
    var dirPromptCallback = function (props) {
            that.dir    = path.join(props.dir, '/');
        var dirToCreate = that.dir;
        if (ownDir){
            dirToCreate = path.join(dirToCreate, '..');
        }
        if (!fs.existsSync(dirToCreate)) {
            that.prompt([{
                name:       'isConfirmed',
                type:       'confirm',
                message:    'El directorio' + chalk.cyan(dirToCreate) + ' no existe. ¿Desea crear este directorio?'
            }], function(props) {
                if (props.isConfirmed) {
                    cb();
                } else {
                    that.prompt(dirPrompt, dirPromptCallback);
                }
            });
        } else if (ownDir && fs.existsSync(that.dir)) {
            that.prompt([{
                name:       'isConfirmed',
                type:       'confirm',
                message:    'El directorio' + chalk.cyan(that.dir) + ' ya existe. Los componentes de este tipo contienen varios archivos y por lo general se ponen dentro directorios propios. ¿Desea continuar en este directorio?'
            }], function(props) {
                if (props.isConfirmed) {
                    cb();
                } else {
                    that.prompt(dirPrompt, dirPromptCallback);
                }
            });
        } else {
            cb();
        }
    };
    that.prompt(dirPrompt, dirPromptCallback);
};

// Se define la funcion que realiza el recorrido de la generacion de un modulo
exports.askForModuleAndDir = function(type, that, ownDir, cb) {
    exports.askForModule(type, that, function(module){
        exports.askForDir(type, that, module, ownDir, cb);
    });
};