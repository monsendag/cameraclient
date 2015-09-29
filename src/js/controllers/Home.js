define(['angular', 'toastr', 'jquery'], function(angular, toastr, $) {

    var app = angular.module('app');

    app.controller('HomeController', function($scope, ImageService) {

      
      $scope.loading = false;
      
      $scope.state = {};
      
      $scope.getImage = function() {
        
        $scope.loading = true;
        
        var url = ImageService.getImage($scope.params)
        .then(function(url){
          $('html').css('background-image', 'url('+url+')');
        })
        .finally(function() {
          $scope.loading = false;
        });
        
      }
      
      var params = $scope.params = {
        hostname: "lama.local",
        rotation: 180,
        vflip: false,
        hflip: false,
        awb_mode: 'auto',
        image_effect: 'none',
        metering_mode: 'average',
        drc_strength: 'low',
        quality: 90,
        width: 1920,
        height: 1280,
        iso: 0, // auto
        saturation: 0,
        sharpness: 0,
        shutter_speed: 0,
        brightness: 50, 
        contrast: 0
      };
      
      $scope.auto_shutter = true;
      $scope.auto_iso = true;
      
      
      $scope.rotations = [0, 90, 180, 270];
      
      $scope.awb_modes = ['off', 'auto', 'sunlight', 'cloudy', 'shade', 'tungsten', 
                          'fluorescent', 'incandescent', 'flash', 'horizon'];
      
      $scope.image_effects = ['none', 'negative', 'solarize', 'sketch', 'denoise', 
                              'emboss', 'oilpaint', 'hatch', 'gpen', 'pastel', 'watercolor', 
                              'film', 'blur', 'saturation', 'colorswap', 'washedout', 
                              'posterise', 'colorpoint', 'colorbalance', 'cartoon', 
                              'deinterlace1', 'deinterlace2'];
      
      $scope.metering_modes = ['average', 'spot', 'backlit', 'matrix'];
      
      $scope.drc_strengths = ['off', 'low', 'medium', 'high'];
      
    });

});
