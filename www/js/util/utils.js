angular
    .module('practiceTool')
    .service('Utils', function () {
        this.removeUndefinedNullOrEmpty = function (array) {
            for (var index = array.length - 1; index >= 0; index--) {
                var element = array[index];
                if (angular.isUndefined(element) || element === null || Object.keys(array[index]).length === 0) {
                    array.splice(index, 1);
                }
            }
        };
    });