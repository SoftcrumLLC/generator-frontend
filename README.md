#GeneratorFrontend

Generador de aplicaciones frontend con AngularJS empleado la arquitectura SinglePage. Este generador se encuentra desarrollado bajo las buenas prácticas y tendencias en el desarrollo de software web con AngularJS - [Angular Best Practice Guidelines for Project Structure](http://blog.angularjs.org/2014/02/an-angularjs-style-guide-and-best.html).

Principales características
-------------

* Proporciona una estructura de directorio orientado a grandes proyectos con AngularJS.
     * Cada controlador, servicio, filtro, y la directiva se colocan en su propio archivo.
     * Todos los archivos relacionados con una unidad conceptual se colocan juntos. Por ejemplo, el controlador, HTML, LESS, y prueba unitaria para un parcial se colocan juntos en el mismo directorio.
* Proporciona una construcción prefabricada con Grunt que produce una distribución extremadamente optimizada.
    * Uso del constructor [gruñido-ngmin] (https://github.com/btford/grunt-ngmin) por lo que no tiene que utilizar la sintaxis de inyección de AngularJS para minificación segura (es decir, usted no necesita `$inject` o` (['$scope', '$http', ...`.
    * La tarea `grunt serve` le permite ejecutar un servidor de desarrollo sencillo con watch/livereload habilitados. Además, JSHint y las pruebas unitarias correspondientes se ejecutan para los archivos modificados.
* Se integra Bower para la gestión de paquetes.
* Incluye subgeneradores Yeoman para directivas, servicios, parciales, filtros y módulos.
* Se integra LESS e incluye Bootstrap a través de la fuente de los archivos LESS, lo que le permite volver a utilizar Bootstrap vars/mixins/etc.
* Fácilmente comprobable - Cada subgenerador crea una prueba unitaria. Las pruebas unitarias se pueden ejecutar a través de `grunt test` y se ejecutan automáticamente que está activo la tarea `grunt serve`.

Directorio de la aplicación
-------------

Todos subgeneradores solicitan al usuario que especifique dónde guardar los archivos nuevos. De esta manera usted puede crear cualquier estructura de directorios que desee, incluyendo anidación. El generador va a crear un grupo de archivos en la raíz de su proyecto, incluyendo `index.html`, `app.js`, y `app.less`. Usted determina cómo se estructurará el resto del proyecto. 

En este ejemplo, el usuario ha optado por agrupar el proyecto en una carpeta `admin`, una carpeta `search`, y una carpeta `service`.

    application.less ............... main app-wide styles
    application.js ................. angular module initialization and route setup
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

Prerequisitos: Tener instalado Node.js con NPM en la máquina donde se desea instalar este generador.

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

Hay un conjunto de subgeneradores que inicializan los componentes de AngularJS de manera predeterminada. Cada uno de estos subgeneradores hará lo siguiente:

* Crear uno o más archivos de la arquitectura (javascript, less, html, spec, etc) para el tipo de componente.
* Actualizar index.html e incorporar las etiquetas `script` necesarias.
* Actualizar app.less e incorporar el `@import` según sea necesario.
* Para los parciales, actualizar app.js, incorporando la llamada ruta necesaria si una ruta se introduce en el generador de instrucciones.

Hay subgeneradores para `directive`, `partial`, `service`, `filter`, `module`, y `modal`.

Ejecución de un generador:

    yo generator-frontend:directive     {{mi-directiva}}
    yo generator-frontend:partial       {{mi-partial}}
    yo generator-frontend:service       {{mi-servicio}}
    yo generator-frontend:filter        {{mi-filtro}}
    yo generator-frontend:module        {{mi-modulo}}
    yo generator-frontend:modal         {{mi-modal}}

El subgenerador modal es un atajo conveniente para crear el componente que funcionan como verbos modales para Bootstrap v3.2 y Angular-UI-Bootstrap v0.11 (ambos vienen preconfigurados con este generador). Si usted decide no utilizar cualquiera de estas bibliotecas, simplemente no utilice el subgenerador modal.


Creación de submódulos
-------------

Los submódulos permiten partes más separadas explícitamente en su proyecto. Utilice el comando `yo generator-frontend:module mi-modulo` y especifique un nuevo subdirectorio para colocar el módulo. Una vez que se haya creado el submódulo, ahora pedirá que seleccione el módulo en el cual colocar el nuevo componente.


Proceso de compilación del proyecto
-------------

El proyecto incluirá una construcción prefabricada mediante Grunt que realizará las siguientes tareas: 

* Generar todos los archivos LESS en un archivo CSS minificado.
* El uso de [grunt-angular-templates] (https://github.com/ericclemmons/grunt-angular-plantillas) para convertir todos sus parciales en Javascript.
* El uso de [grunt-ngmin] (https://github.com/btford/grunt-ngmin) a todos los métodos inyectables de AngularJS para realizar una minificación segura. De esta manera usted no tiene que utilizar la sintaxis de matrices.
* Concatena y minifica los archivos JAVASCRIPT en un solo archivo. 
* Sustituye a todas las referencias de scripts apropiados en `index.html` con el archivo CSS y JS minificados. 
* Minifica cualquier imagen en `/img`. 
* Minifica el `index.html`. 
* Copia todos los archivos adicionales necesarios para una construcción distribuida (por ej. Ficheros Font-Awesome, etc). 

El resultado del proceso de compilación del proyecto genera solo dos archivos minificados CSS y JS. 

Los usos de procesos de construcción [grun-dom-munger] (https://github.com/cgross/grunt-dom-munger) para tirar de referencias de script del `index.html`. Esto significa que el archivo index.html es la única fuente de la verdad acerca de lo que constituye su aplicación. Se agrega una nueva biblioteca, nuevo controlador, nueva directiva, etc; no requiere que actualice el archivo de creación. También el orden de las secuencias de comandos en su `index.html` se mantendrá cuando están concatenados. 

Es importante destacar que, grunt-dom-munger usa CSS selectores de atributos para gestionar el análisis de las etiquetas de script y enlace. Es muy fácil de excluir ciertos scripts u hojas de estilo de los archivos concatenados. Este suele ser el caso si usted está usando un CDN. Esto también puede ser utilizado para prevenir ciertos scripts de desarrollo de ser incluido en la construcción final. 

* Para evitar una secuencia de comandos o de estilos de ser incluido en la concatenación, poner un `'data-concat="false"` en el enlace o etiqueta script. Esto se aplica actualmente para el `livereload.js` y etiquetas script `less.js`. 

* Para evitar una etiqueta de script o el vínculo de ser retirado de la `index.html` finalizado, use un `'data-remove="false"`.


Historia de liberación
-------------
* 28/08/2014 - v0.1.0 - Se terminan las moficaciones de configuración de la arquitectura y se procede a definir la instancia de creación de los componentes
* 28/08/2014 - v0.0.3 - Se modifican las estructuras de los archivos de la carpeta raíz, iniciando la estructura de la arquitectura modular para proyectos frontend
* 27/08/2014 - v0.0.2 - Se generan los componentes principales de la aplicación
* 26/08/2014 - v0.0.1 - Se inicia el proyecto del generador de aplicaciones frontend con AngularJS 'GeneratorFrontend'