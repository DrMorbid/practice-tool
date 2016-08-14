angular
        .module('practiceTool')
        .service(
                'ExerciseService',
                function($ionicPlatform, $cordovaSQLite, $q, ExerciseDTO, PracticeResultDTO, Utils, TEMPO_TYPE) {
                    var exerciseEntityName = 'exerciseEntity';

                    this.getAllExercises = function() {
                        var result = $q.defer();

                        $ionicPlatform.ready(function() {
                            var query = 'SELECT * FROM exercise ORDER BY projectId ASC';
                            $cordovaSQLite.execute(practiceToolDb, query).then(
                                    function(exerciseEntities) {
                                        var exercises = {};
                                        if (exerciseEntities.rows.length > 0) {
                                            console.log('Retrieved Exercises from data source: exerciseEntities='
                                                    + JSON.stringify(exerciseEntities));
                                            for (var index = 0; index < exerciseEntities.rows.length; index++) {
                                                var exerciseEntity = exerciseEntities.rows.item(index);
                                                exercises[exerciseEntity.id] = ExerciseDTO.build(exerciseEntity);
                                            }
                                        } else {
                                            console.log('No Exercises found in data source');
                                        }
                                        result.resolve(exercises);
                                    }, function(err) {
                                        result.reject(err);
                                    });
                        });

                        return result.promise;
                    };

                    this.getExercisesForProject = function(projectId) {
                        var result = $q.defer();

                        $ionicPlatform.ready(function() {
                            var query = 'SELECT * FROM exercise WHERE projectId = ?';
                            $cordovaSQLite.execute(practiceToolDb, query, [ projectId ]).then(
                                    function(exerciseEntities) {
                                        var exercises = {};
                                        if (exerciseEntities.rows.length > 0) {
                                            console.log('Retrieved Exercises for Project from data source: projectId='
                                                    + projectId + ', exerciseEntities='
                                                    + JSON.stringify(exerciseEntities));
                                            for (var index = 0; index < exerciseEntities.rows.length; index++) {
                                                var exerciseEntity = exerciseEntities.rows.item(index);
                                                exercises[exerciseEntity.id] = ExerciseDTO.build(exerciseEntity);
                                            }
                                        } else {
                                            console.log('No Exercises found for Project in data source: projectId='
                                                    + projectId);
                                        }
                                        result.resolve(exercises);
                                    }, function(err) {
                                        result.reject(err);
                                    });
                        });

                        return result.promise;
                    };

                    this.getActivePrioritizedExercisesForProject = function(projectId) {
                        return _getActivePrioritizedExercisesForProject(projectId);
                    };

                    this.getActiveNotPrioritizedExercisesForProject = function(projectId) {
                        return _getActiveNotPrioritizedExercisesForProject(projectId);
                    };

                    this.saveExercise = function(exercise) {
                        return _saveExercise(exercise);
                    };

                    this.removeExercise = function(exerciseId) {
                        var result = $q.defer();

                        $ionicPlatform.ready(function() {
                            var query = 'DELETE FROM exercise WHERE id = ?';
                            $cordovaSQLite.execute(practiceToolDb, query, [ exerciseId ]).then(
                                    function(deleteResult) {
                                        console.log('Removed Exercise from data source: deleteResult='
                                                + JSON.stringify(deleteResult));
                                        result.resolve(deleteResult);
                                    }, function(err) {
                                        result.reject(err);
                                    });
                        });

                        return result.promise;
                    };

                    this.removeExercises = function(projectId) {
                        console.log('Removing Exercises for Project from data source: projectId=' + projectId);

                        $ionicPlatform.ready(function() {
                            var query = 'DELETE FROM exercise WHERE projectId = ?';
                            $cordovaSQLite.execute(practiceToolDb, query, [ projectId ]).then(
                                    function(result) {
                                        console.log('Removed Exercises for Project from data source: projectId='
                                                + projectId + ', result=' + JSON.stringify(result));
                                    }, function(err) {
                                        console.error(err);
                                    });
                        });
                    };

                    this.resetExercises = function(projectId) {
                        console.log('Resetting Exercises for Project in data source: projectId=' + projectId);

                        _resetActivePrioritizedExercises(projectId);
                        _resetActiveNotPrioritizedExercises(projectId);
                    };

                    this.savePracticeResult = function(practiceResult) {
                        console.log('Saving Practice Result in data source: practiceResult='
                                + JSON.stringify(practiceResult));

                        _savePracticeResultExercises(practiceResult.prioritized);
                        _savePracticeResultExercises(practiceResult.lastPracticedFast);
                        _savePracticeResultExercises(practiceResult.lastPracticedSlow);
                    };

                    // ----------

                    /**
                     * @private
                     */
                    function _resetActivePrioritizedExercises(projectId) {
                        _getActivePrioritizedExercisesForProject(projectId).then(function(exercises) {
                            if (projectId && exercises && Object.keys(exercises).length !== 0) {
                                var previousTempoType = TEMPO_TYPE.slow;
                                angular.forEach(exercises, function(exercise, exerciseId) {
                                    exercise.lastPracticed = null;
                                    exercise.lastPracticedTempo = TEMPO_TYPE.getOpposite(previousTempoType);
                                    previousTempoType = TEMPO_TYPE.getOpposite(previousTempoType);
                                    _saveExercise(exercise);
                                });
                            }
                        }, function(err) {
                            console.error(err);
                        });
                    }

                    /**
                     * @private
                     */
                    function _resetActiveNotPrioritizedExercises(projectId) {
                        _getActiveNotPrioritizedExercisesForProject(projectId).then(function(exercises) {
                            if (projectId && exercises && Object.keys(exercises).length !== 0) {
                                var previousTempoType = TEMPO_TYPE.slow;
                                angular.forEach(exercises, function(exercise, exerciseId) {
                                    exercise.lastPracticed = null;
                                    exercise.lastPracticedTempo = TEMPO_TYPE.getOpposite(previousTempoType);
                                    previousTempoType = TEMPO_TYPE.getOpposite(previousTempoType);
                                    _saveExercise(exercise);
                                });
                            }
                        }, function(err) {
                            console.error(err);
                        });
                    }

                    /**
                     * @private
                     */
                    function _savePracticeResultExercises(exercises) {
                        angular.forEach(exercises, function(exercise) {
                            exercise.lastPracticed = new Date();
                            exercise.lastPracticedTempo = TEMPO_TYPE.getOpposite(exercise.lastPracticedTempo);
                            _saveExercise(exercise);
                        });
                    }

                    /**
                     * @private
                     */
                    function _saveExercise(exercise) {
                        var result = $q.defer();

                        _getExercise(exercise.id)
                                .then(
                                        function(existingExercise) {
                                            var query = '';

                                            if (existingExercise.isEmpty()) {
                                                console.log('Adding new Exercise to data source: exercise='
                                                        + JSON.stringify(exercise));
                                                query = 'INSERT INTO exercise (projectId, name, active, prioritized, slowTempo, fastTempo, lastPracticed, lastPracticedTempo, id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
                                            } else {
                                                console.log('Updating existing Exercise in data source: exercise='
                                                        + JSON.stringify(exercise));
                                                query = 'UPDATE exercise SET projectId = ?, name = ?, active = ?, prioritized = ?, slowTempo = ?, fastTempo = ?, lastPracticed = ?, lastPracticedTempo = ? WHERE id = ?';
                                            }

                                            exercise.toEntity();
                                            console.log('Saving Exercise: exercise=' + JSON.stringify(exercise));
                                            $ionicPlatform.ready(function() {
                                                $cordovaSQLite.execute(
                                                        practiceToolDb,
                                                        query,
                                                        [ exercise.projectId, exercise.name, exercise.active,
                                                                exercise.prioritized, exercise.slowTempo,
                                                                exercise.fastTempo, exercise.lastPracticed,
                                                                exercise.lastPracticedTempo, exercise.id ]).then(
                                                        function(saveResult) {
                                                            console.log('Saved Exercise in data source: saveResult='
                                                                    + JSON.stringify(saveResult));
                                                            result.resolve(saveResult);
                                                        }, function(err) {
                                                            console.error(err);
                                                            result.reject(err);
                                                        });
                                            });
                                        }, function(err) {
                                            console.log(err);
                                        });

                        return result.promise;
                    }

                    /**
                     * @private
                     */
                    function _getExercise(exerciseId) {
                        var result = $q.defer();

                        $ionicPlatform.ready(function() {
                            var query = 'SELECT * FROM exercise WHERE id = ?';
                            $cordovaSQLite.execute(practiceToolDb, query, [ exerciseId ]).then(
                                    function(exerciseEntity) {
                                        var exercise = ExerciseDTO.build();
                                        if (exerciseEntity.rows.length === 1) {
                                            console.log('Retrieved Exercise from data source: exerciseId=' + exerciseId
                                                    + ', exerciseEntity=' + JSON.stringify(exerciseEntity));
                                            exercise = ExerciseDTO.build(exerciseEntity.rows.item(0));
                                        } else {
                                            console.log("No Exercise (or more than one) found in data source");
                                        }
                                        result.resolve(exercise);
                                    }, function(err) {
                                        result.reject(err);
                                    });
                        });

                        return result.promise;
                    }

                    /**
                     * @private
                     */
                    function _getActivePrioritizedExercisesForProject(projectId) {
                        var result = $q.defer();

                        $ionicPlatform
                                .ready(function() {
                                    var query = 'SELECT * FROM exercise WHERE active = 1 and prioritized = 1 and projectId = ?';
                                    $cordovaSQLite
                                            .execute(practiceToolDb, query, [ projectId ])
                                            .then(
                                                    function(exerciseEntities) {
                                                        var exercises = {};
                                                        if (exerciseEntities.rows.length > 0) {
                                                            console
                                                                    .log('Retrieved active and prioritized Exercises for Project from data source: projectId='
                                                                            + projectId
                                                                            + ', exerciseEntities='
                                                                            + JSON.stringify(exerciseEntities));
                                                            for (var index = 0; index < exerciseEntities.rows.length; index++) {
                                                                var exerciseEntity = exerciseEntities.rows.item(index);
                                                                exercises[exerciseEntity.id] = ExerciseDTO
                                                                        .build(exerciseEntity);
                                                            }
                                                        } else {
                                                            console
                                                                    .log('No active and prioritized Exercises found for Project in data source: projectId='
                                                                            + projectId);
                                                        }
                                                        result.resolve(exercises);
                                                    }, function(err) {
                                                        result.reject(err);
                                                    });
                                });

                        return result.promise;
                    }

                    /**
                     * @private
                     */
                    function _getActiveNotPrioritizedExercisesForProject(projectId) {
                        var result = $q.defer();

                        $ionicPlatform
                                .ready(function() {
                                    var query = 'SELECT * FROM exercise WHERE active = 1 and prioritized = 0 and projectId = ?';
                                    $cordovaSQLite
                                            .execute(practiceToolDb, query, [ projectId ])
                                            .then(
                                                    function(exerciseEntities) {
                                                        var exercises = {};
                                                        if (exerciseEntities.rows.length > 0) {
                                                            console
                                                                    .log('Retrieved active and not prioritized Exercises for Project from data source: projectId='
                                                                            + projectId
                                                                            + ', exerciseEntities='
                                                                            + JSON.stringify(exerciseEntities));
                                                            for (var index = 0; index < exerciseEntities.rows.length; index++) {
                                                                var exerciseEntity = exerciseEntities.rows.item(index);
                                                                exercises[exerciseEntity.id] = ExerciseDTO
                                                                        .build(exerciseEntity);
                                                            }
                                                        } else {
                                                            console
                                                                    .log('No active and not prioritized Exercises found for Project in data source: projectId='
                                                                            + projectId);
                                                        }
                                                        result.resolve(exercises);
                                                    }, function(err) {
                                                        result.reject(err);
                                                    });
                                });

                        return result.promise;
                    }
                });