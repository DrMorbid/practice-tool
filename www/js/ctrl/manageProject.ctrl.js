angular.module('practiceTool').controller(
        'ManageProjectCtrl',
        function($scope, $ionicModal, $stateParams, ExerciseService, ProjectService, ExerciseDTO, TEMPO, TEMPO_TYPE) {
            // fields
            $scope.vm = {
                projectId : $stateParams.projectId,
                project : {},
                exercises : {},
                activeNotPrioritizedExercises : {},
                exerciseToSave : {},
                slowTempoLabel : TEMPO_TYPE.slow.label,
                fastTempoLabel : TEMPO_TYPE.fast.label,
                availableTempos : TEMPO.getAllTempos(),
                availableTempoTypes : TEMPO_TYPE.getAllTempoTypes(),
                modalTitle : '',
                dirty : false
            };

            _loadData();

            // methods
            $scope.openAddExerciseModal = function() {
                _initExerciseToSave();
                $scope.addOrUpdateExerciseModal.show();
            };

            $scope.openUpdateExerciseModal = function(exercise) {
                $scope.vm.exerciseToSave = exercise;
                $scope.addOrUpdateExerciseModal.show();
            };

            $scope.closeAddOrUpdateExerciseModal = function() {
                $scope.addOrUpdateExerciseModal.hide();
            };

            $scope.addOrUpdateExercise = function() {
                console.log('addOrUpdateExercise before: $scope.vm.exerciseToSave.lastPracticed=' + $scope.vm.exerciseToSave.lastPracticed);
                if (typeof $scope.vm.exerciseToSave.lastPracticed === 'string') {
                    $scope.vm.exerciseToSave.lastPracticed = new Date($scope.vm.exerciseToSave.lastPracticed);
                }
                console.log('addOrUpdateExercise after: $scope.vm.exerciseToSave.lastPracticed=' + $scope.vm.exerciseToSave.lastPracticed);
                
                ExerciseService.saveExercise($scope.vm.exerciseToSave).then(function() {
                    _initExercises();
                }, function(err) {
                    console.error(err);
                });

                $scope.closeAddOrUpdateExerciseModal();
            };

            $scope.removeExercise = function(exerciseId) {
                ExerciseService.removeExercise(exerciseId).then(function() {
                    _initExercises();
                }, function(err) {
                    console.error(err);
                });
            };

            $scope.updateProject = function() {
                ProjectService.saveProject($scope.vm.project).then(function() {
                    $scope.vm.dirty = false;
                }, function(err) {
                    console.error(err);
                });
            };

            // ----------

            /**
             * @private
             */
            function _loadData() {
                _initModal();
                _initProject();
                _initExercises();
                _initExerciseToSave();
            }

            /**
             * @private
             */
            function _initModal() {
                $ionicModal.fromTemplateUrl('templates/manage/add-update-exercise-modal.html', {
                    scope : $scope
                }).then(function(modal) {
                    $scope.addOrUpdateExerciseModal = modal;
                });
            }

            /**
             * @private
             */
            function _initProject() {
                $scope.vm.project = {};

                ProjectService.getProject($scope.vm.projectId).then(function(project) {
                    $scope.vm.project = project
                }, function(err) {
                    console.error(err);
                });
            }

            /**
             * @private
             */
            function _initExercises() {
                $scope.vm.exercises = {};

                ExerciseService.getExercisesForProject($scope.vm.projectId).then(function(exercises) {
                    $scope.vm.exercises = exercises;
                }, function(err) {
                    console.error(err);
                });

                ExerciseService.getActiveNotPrioritizedExercisesForProject($scope.vm.projectId).then(
                        function(exercises) {
                            $scope.vm.activeNotPrioritizedExercises = exercises;
                        }, function(err) {
                            console.error(err);
                        });
            }

            /**
             * @private
             */
            function _initExerciseToSave() {
                $scope.vm.exerciseToSave = ExerciseDTO
                        .buildNew($scope.vm.projectId, _determineNextLastPracticedTempo());
            }

            /**
             * @private
             */
            function _determineNextLastPracticedTempo() {
                var result = TEMPO_TYPE.fast;

                var fastCount = 0;
                var slowCount = 0;
                angular.forEach($scope.vm.activeNotPrioritizedExercises, function(exercise) {
                    if (exercise.lastPracticedTempo === TEMPO_TYPE.fast) {
                        fastCount++;
                    } else if (exercise.lastPracticedTempo === TEMPO_TYPE.slow) {
                        slowCount++;
                    }
                });

                if (fastCount > slowCount) {
                    result = TEMPO_TYPE.slow;
                }

                return result;
            }
        });