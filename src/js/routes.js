'use strict';

define(['angular', 'controllers'], function (angular) {

    var app = angular.module('app');

    app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

        // default
        $urlRouterProvider.otherwise('/');

        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'views/home.html',
            controller: 'HomeController'
        });
        
        
    });

});
