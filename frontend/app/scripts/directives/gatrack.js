'use strict';

angular.module('frontendApp')
  .directive('gaTrack', function (ga) {
    return {
      restrict: 'A',
      scope: {
        action: '@gaTrack',
        label: '@gaLabel'
      },
      link: function postLink(scope, element, attrs) {
        element.bind(scope.action, function(e){
          ga('send', 'event', 'button', scope.action, scope.label);
        });
      }
    };
  });
