angular.module('practiceTool').service(
        'ProjectService',
        function($ionicPlatform, $cordovaSQLite, $q, uuid, ExerciseService, ProjectDTO) {
            var projectEntityName = 'projectEntity';

            this.getProjects = function() {
                return _getProjects();
            };

            this.getProject = function(projectId) {
                var result = $q.defer();

                $ionicPlatform.ready(function() {
                    var query = 'SELECT * FROM project WHERE id = ?';
                    $cordovaSQLite.execute(practiceToolDb, query, [ projectId ]).then(
                            function(projectEntity) {
                                var project = ProjectDTO.build();
                                if (projectEntity.rows.length === 1) {
                                    console.log('Retrieved Project from data source: projectId=' + projectId
                                            + ', projectEntity=' + JSON.stringify(projectEntity));
                                    project = ProjectDTO.build(projectEntity.rows.item(0));
                                } else {
                                    console.log("No Project (or more than one) found in data source");
                                }
                                result.resolve(project);
                            }, function(err) {
                                result.reject(err);
                            });
                });

                return result.promise;
            };

            this.saveProject = function(project) {
                var result = $q.defer();

                this.getProject(project.id).then(
                        function(existingProject) {
                            var query = '';

                            if (existingProject.isEmpty()) {
                                console.log('Adding new Project to data source: project=' + JSON.stringify(project));
                                query = 'INSERT INTO project (name, id) VALUES (?, ?)';
                            } else {
                                console.log('Updating existing Project in data source: project='
                                        + JSON.stringify(project));
                                query = 'UPDATE project SET name = ? WHERE id = ?';
                            }

                            $ionicPlatform.ready(function() {
                                $cordovaSQLite.execute(practiceToolDb, query, [ project.name, project.id ]).then(
                                        function(saveResult) {
                                            console.log('Saved Project in data source: saveResult='
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
            };

            this.removeProject = function(projectId) {
                var result = $q.defer();

                $ionicPlatform.ready(function() {
                    var query = 'DELETE FROM project WHERE id = ?';
                    $cordovaSQLite.execute(practiceToolDb, query, [ projectId ]).then(function(deleteResult) {
                        console.log('Removed Project from data source: result=' + JSON.stringify(deleteResult));
                        result.resolve(deleteResult);
                    }, function(err) {
                        console.error(err);
                        result.reject(err);
                    });
                });

                ExerciseService.removeExercises(projectId);

                return result.promise;
            };

            this.resetAll = function() {
                console.log('Resetting all Projects in data source');

                $ionicPlatform.ready(function() {
                    _getProjects().then(function(projects) {
                        angular.forEach(projects, function(project) {
                            ExerciseService.resetExercises(project.id);
                        });
                    }, function(err) {
                        console.error(err);
                    });
                });
            };

            // ----------

            /**
             * @private
             */
            function _getProjects() {
                var result = $q.defer();

                $ionicPlatform.ready(function() {
                    var query = 'SELECT * FROM project ORDER BY name ASC';
                    $cordovaSQLite.execute(practiceToolDb, query).then(
                            function(projectEntities) {
                                var projects = {};
                                if (projectEntities.rows.length > 0) {
                                    console.log('Retrieved Projects from data source: projectEntities='
                                            + JSON.stringify(projectEntities));
                                    for (var index = 0; index < projectEntities.rows.length; index++) {
                                        var projectEntity = projectEntities.rows.item(index);
                                        projects[projectEntity.id] = ProjectDTO.build(projectEntity);
                                    }
                                } else {
                                    console.log('No Projects found in data source');
                                }
                                result.resolve(projects);
                            }, function(err) {
                                result.reject(err);
                            });
                });

                return result.promise;
            }
        });