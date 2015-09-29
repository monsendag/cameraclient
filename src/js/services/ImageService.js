define(['angular', 'jquery'], function (angular, $) {

    var app = angular.module('app');

    function randomString() {
      return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    }


    app.service('ImageService', function($q) {
      
      var cachebust = "&bust="+randomString();
      

        this.getImage = function(params) {
          
          return $q(function(resolve, reject) {
            
            var img = new Image();
            
            img.onerror = reject;
            
            var baseAddress = "http://"+params.hostname+":5000/still?" + cachebust + "&";
            
            
            var url = baseAddress + $.param(params);
            
            var img = new Image();
            img.onload = function() {
              resolve(url);
            };
            
            img.src = url;
            
          });
          
          
        }
        
    });
    
    

});