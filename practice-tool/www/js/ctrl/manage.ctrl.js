angular.module('practiceTool').controller('ManageCtrl',
        function($scope, $ionicModal, $state, ProjectService, ProjectDTO) {
            // fields
            $scope.vm = {
                projects : {},
                newProject : {}
            }

            _loadData();

            // methods
            $scope.openAddProjectModal = function() {
                $scope.addProjectModal.show();
            };

            $scope.closeAddProjectModal = function() {
                $scope.addProjectModal.hide();
            };

            $scope.addProject = function() {
                ProjectService.saveProject($scope.vm.newProject).then(function() {
                    _initProjects();
                    _initNewProject();

                    $scope.closeAddProjectModal();
                }, function(err) {
                    console.error(err);
                });
            };

            $scope.removeProject = function(projectId) {
                ProjectService.removeProject(projectId).then(function() {
                    _initProjects();
                }, function(err) {
                    console.error(err);
                });
            };

            $scope.openProjectDeatil = function(projectId) {
                $state.go('^.manage-project', {
                    'projectId' : projectId
                });
            };

            // ----------

            /**
             * @private
             */
            function _loadData() {
                _initModal();
                _initProjects();
                _initNewProject();
            }

            /**
             * @private
             */
            function _initModal() {
                $ionicModal.fromTemplateUrl('templates/manage/add-project-modal.html', {
                    scope : $scope
                }).then(function(modal) {
                    $scope.addProjectModal = modal;
                });
            }

            /**
             * @private
             */
            function _initProjects() {
                ProjectService.getProjects().then(function(projects) {
                    $scope.vm.projects = projects;
                }, function(err) {
                    console.error(err);
                });
            }

            /**
             * @private
             */
            function _initNewProject() {
                $scope.vm.newProject = ProjectDTO.buildNew();
            }
        });