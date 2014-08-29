// Se define el uso de sintaxis Node.js
'use strict';

// Se definen todos los componentes que se requiren para poder ejecutar la aplicacion
var util            = require('util');
var path            = require('path');
var yeoman          = require('yeoman-generator');
var frontendUtils   = require('../utils.js');

//
var FrontendGenerator = module.exports = function FrontendGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);
    this.on('end', function () {
        this.config.set('partialDirectory',     'partial/');
        this.config.set('directiveDirectory',   'directive/');
        this.config.set('filterDirectory',      'filter/');
        this.config.set('serviceDirectory',     'service/');
        var inject = {
            js: {
                file:               'index.html',
                marker:             frontendUtils.JS_MARKER,
                template:           '<script src="<%= filename %>"></script>'
            },
            less: {
                relativeToModule:   true,
                file:               '<%= module %>.less',
                marker:             frontendUtils.LESS_MARKER,
                template:           '@import "<%= filename %>";'
            }
        };
        this.config.set('inject', inject);
        this.config.save();
        this.installDependencies({ skipInstall: options['skip-install'] });
    });
    this.pkg    = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

//
util.inherits(FrontendGenerator, yeoman.generators.Base);

//
FrontendGenerator.prototype.askFor = function askFor() {
    var cb = this.async();
    var prompts = [{
        name:       'appname',
        message:    '¿Qué nombre tendrá el proyecto?',
        default:    path.basename(process.cwd())
    }];
    this.prompt(prompts, function (props) {
        this.appname    = props.appname;
        cb();
    }.bind(this));
};

//
FrontendGenerator.prototype.askForUiRouter = function askFor() {
    var cb      = this.async();
    var prompts = [{
        name:       'router',
        type:       'list',
        message:    '¿Qué componente de ruteo desea ocupar en el proyecto?',
        default:    0,
        choices:    ['Standard Angular Router', 'Angular UI Router']
    }];
    this.prompt(prompts, function (props) {
        if (props.router === 'Angular UI Router') {
            this.uirouter               = true;
            this.routerJs               = 'bower_components/angular-ui-router/release/angular-ui-router.js';
            this.routerModuleName       = 'ui.router';
            this.routerViewDirective    = 'ui-view';
        } else {
            this.uirouter               = false;
            this.routerJs               = 'bower_components/angular-route/angular-route.js';
            this.routerModuleName       = 'ngRoute';
            this.routerViewDirective    = 'ng-view';
        }
        this.config.set('uirouter',this.uirouter);
        cb();
    }.bind(this));
};

//
FrontendGenerator.prototype.app = function app() {
    this.directory('skeleton/', './');
};