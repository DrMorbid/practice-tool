angular.module('practiceTool').controller(
        'PracticeResultCtrl',
        function($scope, $stateParams, $state, ExerciseService, PracticeResultExtractor, Utils, PracticeResultDTO,
                TEMPO_TYPE) {
            // fields
            $scope.vm = {
                projectId : $stateParams.projectId,
                nrOfExercises : $stateParams.nrOfExercises,
                processedPracticeResult : {},
                prioritized : [],
                normal : []
            };

            _loadData();

            // methods
            $scope.determineNextPracticedTempo = function(exercise) {
                var result = exercise.slowTempo;

                if (exercise.lastPracticedTempo === TEMPO_TYPE.slow) {
                    result = exercise.fastTempo;
                }

                return result;
            };

            $scope.savePracticeResult = function() {
                ExerciseService.savePracticeResult($scope.vm.processedPracticeResult);
                $state.go('^.practice');
            };

            // ----------

            /**
             * @private
             */
            function _loadData() {
                ExerciseService.getExercisesForProject($scope.vm.projectId).then(
                        function(exercises) {
                            var resultBeforeProcessing = new PracticeResultDTO();

                            angular.forEach(exercises, function(exercise) {
                                console.log('Practice Result: exercise=' + JSON.stringify(exercise));
                                if (exercise.active) {
                                    if (exercise.prioritized) {
                                        resultBeforeProcessing.addPrioritized(exercise);
                                    } else if (exercise.lastPracticedTempo === TEMPO_TYPE.fast) {
                                        resultBeforeProcessing.addLastPracticedFast(exercise);
                                    } else if (exercise.lastPracticedTempo === TEMPO_TYPE.slow) {
                                        resultBeforeProcessing.addLastPracticedSlow(exercise);
                                    }
                                }
                            });

                            var resultAfterProcessing = PracticeResultExtractor.process(resultBeforeProcessing,
                                    $scope.vm.nrOfExercises);
                            $scope.vm.processedPracticeResult = resultAfterProcessing;

                            $scope.vm.prioritized = resultAfterProcessing.getPrioritizedOrdered();

                            var evenIndex = 0;
                            angular.forEach(resultAfterProcessing.getLastPracticedFastOrdered(), function(
                                    lastPracticedFast) {
                                $scope.vm.normal[evenIndex] = lastPracticedFast;
                                evenIndex = evenIndex + 2;
                            });

                            var oddIndex = 1;
                            angular.forEach(resultAfterProcessing.getLastPracticedSlowOrdered(), function(
                                    lastPracticedSlow) {
                                $scope.vm.normal[oddIndex] = lastPracticedSlow;
                                oddIndex = oddIndex + 2;
                            });

                            Utils.removeUndefinedNullOrEmpty($scope.vm.normal);
                        }, function(err) {
                            console.error(err);
                        });

            }
        });