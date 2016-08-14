var practiceToolDb = null;

// angular.module is a global place for creating, registering and retrieving
// Angular modules
// 'starter' is the name of this angular module example (also set in a <body>
// attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular
        .module('practiceTool', [ 'ionic', 'angular-uuid', 'ngCordova' ])
        .run(
                function($ionicPlatform, $cordovaSQLite) {
                    $ionicPlatform
                            .ready(function() {
                                // Hide the accessory bar by default (remove
                                // this to show the accessory
                                // bar above the keyboard
                                // for form inputs)
                                if (window.cordova && window.cordova.plugins.Keyboard) {
                                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                                    cordova.plugins.Keyboard.disableScroll(true);
                                }
                                if (window.StatusBar) {
                                    // org.apache.cordova.statusbar required
                                    StatusBar.styleDefault();
                                }

                                practiceToolDb = $cordovaSQLite.openDB({
                                    name : 'practice-result.db',
                                    location : 'default'
                                });
                                $cordovaSQLite.execute(practiceToolDb,
                                        'CREATE TABLE IF NOT EXISTS project (id text primary key, name text)');
                                $cordovaSQLite
                                        .execute(
                                                practiceToolDb,
                                                'CREATE TABLE IF NOT EXISTS exercise (id text primary key, projectId text, name text, active integer, prioritized integer, slowTempo integer, fastTempo integer, lastPracticed text, lastPracticedTempo text)');
                                // $cordovaSQLite.execute(practiceToolDb,
                                // 'DELETE FROM project');
                            });
                }).config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
            $ionicConfigProvider.tabs.position('bottom');

            $stateProvider.state('app', {
                url : '/app',
                abstract : true,
                templateUrl : 'templates/app/menu.html',
                controller : 'AppCtrl'
            }).state('app.practice', {
                url : '/practice',
                views : {
                    'practice-tab' : {
                        templateUrl : 'templates/practice/practice.html',
                        controller : 'PracticeCtrl'
                    }
                }
            }).state('app.practice-result', {
                url : '/practice/:projectId/:nrOfExercises',
                views : {
                    'practice-tab' : {
                        templateUrl : 'templates/practice/practice-result.html',
                        controller : 'PracticeResultCtrl'
                    }
                }
            }).state('app.manage', {
                url : '/manage',
                views : {
                    'manage-tab' : {
                        templateUrl : 'templates/manage/manage.html',
                        controller : 'ManageCtrl'
                    }
                }
            }).state('app.manage-project', {
                url : '/manage/:projectId',
                views : {
                    'manage-tab' : {
                        templateUrl : 'templates/manage/manage-project.html',
                        controller : 'ManageProjectCtrl'
                    }
                }
            }).state('app.reset', {
                url : '/reset',
                views : {
                    'reset-tab' : {
                        templateUrl : 'templates/reset/reset.html',
                        controller : 'ResetCtrl'
                    }
                }
            });

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/practice');

            // TODO: Save statistics
            // TODO: Add icon
            // TODO: Tweak styles
        });
