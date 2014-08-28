#GeneratorFrontend

>Generador de aplicaciones frontend con AngularJS empleado la arquitectura SinglePage

This generator follows the [Angular Best Practice Guidelines for Project Structure](http://blog.angularjs.org/2014/02/an-angularjs-style-guide-and-best.html).

Principales características

* Provides a directory structure geared towards large Angular projects.
    * Each controller, service, filter, and directive are placed in their own file.
    * All files related to a conceptual unit are placed together.  For example, the controller, HTML, LESS, and unit test for a partial are placed together in the same directory.
* Provides a ready-made Grunt build that produces an extremely optimized distribution.
   * Build uses [grunt-ngmin](https://github.com/btford/grunt-ngmin) so you don't have to use the Angular injection syntax for safe minification (i.e. you dont need `$inject` or `(['$scope','$http',...`.
   * `grunt serve` task allows you to run a simple development server with watch/livereload enabled.  Additionally, JSHint and the appropriate unit tests are run for the changed files.
* Integrates Bower for package management
* Includes Yeoman subgenerators for directives, services, partials, filters, and modules.
* Integrates LESS and includes Bootstrap via the source LESS files allowing you to reuse Bootstrap vars/mixins/etc.
* Easily Testable - Each sub-generator creates a skeleton unit test.  Unit tests can be run via `grunt test` and they run automatically during the grunt watch that is active during `grunt serve`.


Directorio de la aplicación
-------------
All subgenerators prompt the user to specify where to save the new files.  Thus you can create any directory structure you desire, including nesting.  The generator will create a handful of files in the root of your project including `index.html`, `app.js`, and `app.less`.  You determine how the rest of the project will be structured.

In this example, the user has chosen to group the app into an `admin` folder, a `search` folder, and a `service` folder.


    app.less ....................... main app-wide styles
    app.js ......................... angular module initialization and route setup
    index.html ..................... main HTML file
    Gruntfile.js ................... Grunt build file
    /admin ......................... example admin module folder
      admin.js ..................... admin module initialization and route setup
      admin.less ................... admin module LESS
      /admin-directive1 ............ angular directives folder
        admin-directive1.js ........ example simple directive
        admin-directive1-spec.js.... example simple directive unit test
      /admin-directive2 ............ example complex directive (contains external partial)
        admin-directive2.js ........ complex directive javascript
        admin-directive2.html ...... complex directive partial
        admin-directive2.less ...... complex directive LESS
        admin-directive2-spec.js ... complex directive unit test
      /admin-partial ............... example partial
        admin-partial.html ......... example partial html
        admin-partial.js ........... example partial controller
        admin-partial.less ......... example partial LESS
        admin-partial-spec.js ...... example partial unit test
    /search ........................ example search component folder
      my-filter.js ................. example filter
      my-filter-spec.js ............ example filter unit test
      /search-partial .............. example partial
        search-partial.html ........ example partial html
        search-partial.js .......... example partial controller
        search-partial.less ........ example partial LESS
        search-partial-spec.js ..... example partial unit test
    /service ....................... angular services folder
        my-service.js .............. example service
        my-service-spec.js ......... example service unit test
        my-service2.js ............. example service
        my-service2-spec.js ........ example service unit test
    /img ........................... images (not created by default but included in /dist if added)
    /dist .......................... distributable version of app built using grunt and Gruntfile.js
    /bower_component................ 3rd party libraries managed by bower
    /node_modules .................. npm managed libraries used by grunt


Guía de instalación
-------------

Prerequisitos: Tener instalado Node.js en la máquina donde se desea instalar este generador.

Una vez que ya tengamos instalado Node.js con NPM correctamente procederemos a instalar Grunt, Yeoman y Bower en la máquina.

    npm install     -g grunt-cli yo bower   (para realizar una instalación)
    npm update      -g grunt-cli yo bower   (para realizar una actualización)

Ya realizado el paso anterior, procederemos a realizar la instalación del generador, para ello necesitamos copiar el directorio del proyecto GeneratorFrontend en nuestra máquina y compilar la solución como sigue:

    mkdir   GeneratorFrontend
    cd      GeneratorFrontend
    git     init
    git     clone git://github.com/SoftcrumLLC/generator-frontend.git
    npm     link

Con esta instrucción tendremos nuestro generador instalado en nuestra máquina sin hacer público su contenido. Para crear un proyecto se necesita realizar los siguientes pasos:

    mkdir   {{MiProyecto}}
    cd      {{MiProyecto}}
    yo      generator-frontend

Nota: Se debe colocar el nombre del proyecto donde se encuentra la variable {{MiProyecto}}.


Tareas programas con Grunt
-------------

Ahora que se ha creado el proyecto, usted posee 3 simples comandos en Grunt disponibles:

    grunt serve   (Esta opción se encuentra disponible para el ambiente de desarrollo)
    grunt test    (Esta opción ejecuta todas las pruebas unitarias y de funcionalidad)
    grunt build   (Esta opción compila el proyecto creando una carpeta de distribución)

Cuando `grunt serve` se encuentra en ejecución, los archivos javascript modificados se verifican usando JSHint así como tener sus pruebas unitarias adecuadas ejecutadas. Sólo las pruebas de unidad que se corresponden con el archivo modificado se ejecutarán. Esto permite un flujo de trabajo basado en pruebas eficiente.


Subgeneradores de GeneratorFrontend
-------------

Hay un conjunto de subgeneradores que inicializan los componentes de AngularJS de manera predeterminada. Cada uno de estos generadores hará lo siguiente: 

* Crear uno o más archivos de esqueleto (javascript, less, html, spec, etc) para el tipo de componente. 
* Actualizar index.html e incorporar las etiquetas `script` necesarias. 
* Actualizar app.less e incorporar el `@import` según sea necesario. 
* Para los parciales, actualizar los app.js, incorporando la llamada ruta necesaria si una ruta se introduce en el generador de instrucciones. 

Hay generadores para `directive`,` partial`, `service`,` filter`, `module`, y `modal`. 

Ejecución de un generador: 

    yo generator-frontend:directive     my-awesome-directive
    yo generator-frontend:partial       my-partial
    yo generator-frontend:service       my-service
    yo generator-frontend:filter        my-filter
    yo generator-frontend:module        my-module
    yo generator-frontend:modal         my-modal


El Parámetro del nombre pasado (es decir, 'mi-impresionante-Directiva ») se utilizará como los nombres de los archivos. Los generadores se derivarán nombres genéricos apropiados de este parámetro (ex. 'Mi-impresionante-directiva' se convertirá en un nombre de clase de 'MyAwesomeDirective'). Cada sub-generador le pedirá la carpeta en la que para crear los nuevos archivos de esqueleto. Puede anular la carpeta predeterminada para cada sub-generador en el archivo .yo-rc.json` `. 

El subgenerator modal es un atajo conveniente para crear los parciales que funcionan como verbos modales para Bootstrap v3.1 y Angular-UI-Bootstrap v0.10 (ambos vienen preconfigurados con este generador). Si usted decide no utilizar cualquiera de estas bibliotecas, simplemente no utilice el subgenerator modal. 

Subgenerators también son personalizables. Por favor, lea [CUSTOMIZING.md] (CUSTOMIZING.md) para más detalles.



There are a set of subgenerators to initialize empty Angular components.  Each of these generators will:

* Create one or more skeleton files (javascript, LESS, html, spec etc) for the component type.
* Update index.html and add the necessary `script` tags.
* Update app.less and add the @import as needed.
* For partials, update the app.js, adding the necessary route call if a route was entered in the generator prompts.

There are generators for `directive`,`partial`,`service`, `filter`, `module`, and `modal`.

Running a generator:

    yo cg-angular:directive my-awesome-directive
    yo cg-angular:partial my-partial
    yo cg-angular:service my-service
    yo cg-angular:filter my-filter
    yo cg-angular:module my-module
    yo cg-angular:modal my-modal

The name paramater passed (i.e. 'my-awesome-directive') will be used as the file names.  The generators will derive appropriate class names from this parameter (ex. 'my-awesome-directive' will convert to a class name of 'MyAwesomeDirective').  Each sub-generator will ask for the folder in which to create the new skeleton files.  You may override the default folder for each sub-generator in the `.yo-rc.json` file.

The modal subgenerator is a convenient shortcut to create partials that work as modals for Bootstrap v3.1 and Angular-UI-Bootstrap v0.10 (both come preconfigured with this generator).  If you choose not to use either of these libraries, simply don't use the modal subgenerator.

Subgenerators are also customizable.  Please read [CUSTOMIZING.md](CUSTOMIZING.md) for details.







Submodules
-------------

Submodules allow you to more explicitly separate parts of your application.  Use the `yo cg-angular:module my-module` command and specify a new subdirectory to place the module into.  Once you've created a submodule, running other subgenerators will now prompt you to select the module in which to place the new component.







Preconfigured Libraries
-------------

The new app will have a handful of preconfigured libraries included.  This includes Angular 1.2, Bootstrap 3, AngularUI Bootstrap, AngularUI Utils, FontAwesome 4, JQuery 2, Underscore 1.5, LESS 1.6, and Moment 2.5.  You may of course add to or remove any of these libraries.  But the work to integrate them into the app and into the build process has already been done for you.



Build Process
-------------

The project will include a ready-made Grunt build that will:

* Build all the LESS files into one minified CSS file.
* Uses [grunt-angular-templates](https://github.com/ericclemmons/grunt-angular-templates) to turn all your partials into Javascript.
* Uses [grunt-ngmin](https://github.com/btford/grunt-ngmin) to preprocess all Angular injectable methods and make them minification safe.  Thus you don't have to use the array syntax.
* Concatenates and minifies all Javascript into one file.
* Replaces all appropriate script references in `index.html` with the minified CSS and JS files.
* Minifies any images in `/img`.
* Minifies the `index.html`.
* Copies any extra files necessary for a distributable build (ex.  Font-Awesome font files, etc).

The resulting build loads only a few highly compressed files.

The build process uses [grunt-dom-munger](https://github.com/cgross/grunt-dom-munger) to pull script references from the `index.html`.  This means that **your index.html is the single source of truth about what makes up your app**.  Adding a new library, new controller, new directive, etc does not require that you update the build file.  Also the order of the scripts in your `index.html` will be maintained when they're concatenated.

Importantly, grunt-dom-munger uses CSS attribute selectors to manage the parsing of the script and link tags.  Its very easy to exclude certain scripts or stylesheets from the concatenated files. This is often the case if you're using a CDN. This can also be used to prevent certain development scripts from being included in the final build.

* To prevent a script or stylesheet from being included in concatenation, put a `data-concat="false"` attribute on the link or script tag.  This is currently applied for the `livereload.js` and `less.js` script tags.

* To prevent a script or link tag from being removed from the finalized `index.html`, use a `data-remove="false"` attribute.


Historia de liberación
-------------
* 28/08/2014 - v0.1.0 - Se terminan las moficaciones de configuración de la arquitectura y se procede a definir la instancia de creación de los componentes
* 28/08/2014 - v0.0.3 - Se modifican las estructuras de los archivos de la carpeta raíz, iniciando la estructura de la arquitectura modular para proyectos frontend
* 27/08/2014 - v0.0.2 - Se generan los componentes principales de la aplicación
* 26/08/2014 - v0.0.1 - Se inicia el proyecto del generador de aplicaciones frontend con AngularJS 'GeneratorFrontend'