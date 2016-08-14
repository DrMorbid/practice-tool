angular.module('practiceTool').controller('PracticeCtrl', function($scope, $state, ProjectService, ExerciseService) {
    // fields
    $scope.vm = {
        availableProjects : {},
        selectedProject : {},
        selectedNumberOfExercises : 2,
        activePrioritizedExercisesCount : 0
    };

    _loadData();

    // methods
    $scope.startPractising = function() {
        $state.go('^.practice-result', {
            'projectId' : $scope.vm.selectedProject.id,
            'nrOfExercises' : $scope.vm.selectedNumberOfExercises
        });
    };
    $scope.loadActivePrioritizedExercisesCount = function() {
        ExerciseService.getActivePrioritizedExercisesForProject($scope.vm.selectedProject.id).then(function(exercises) {
            $scope.vm.activePrioritizedExercisesCount = Object.keys(exercises).length;
        }, function(err) {
            console.error(err);
        });
    };

    // ----------

    /**
     * @private
     */
    function _loadData() {
        ProjectService.getProjects().then(function(projects) {
            $scope.vm.availableProjects = projects;
        }, function(err) {
            console.error(err);
        });
    }
});