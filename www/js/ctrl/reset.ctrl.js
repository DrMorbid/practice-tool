angular.module('practiceTool').controller('ResetCtrl', function($scope, $state, ProjectService) {
    $scope.reset = function() {
        ProjectService.resetAll();
        $state.go('^.practice');
    };
});
