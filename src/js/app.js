define([
    'angular',
    // the remaining dependencies registers themselves with angular
    'angular-bootstrap',
    'angular-ui-router',
    'angular-ui-layout',
    'angular-ui-select',
    'angular-resource',
    'angular-sanitize',
    'angular-i18n',
    'angular-bootstrap-nav-tree',
    'angular-lodash'
  //  'vendor'
//    'videojs',
//    'videojs-contrib-media-sources',
//    'videojs-contrib-hls'
    
], function (angular) {

    var app = angular.module('app', [
        'ui.bootstrap',
        'ui.router',
        'ui.layout',
        'ui.select',
        'ngResource',
        'ngSanitize',
        'angularBootstrapNavTree',
        'angular-lodash'
    ]).config(function() {

      
    }).run(function($rootScope) {
          
        });

    require(['routes', 'controllers', 'services', 'directives', 'filters'], function() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['app']);
        });
    });



    return app;

});
