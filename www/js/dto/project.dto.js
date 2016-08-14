angular.module('practiceTool').factory('ProjectDTO', function(uuid) {
    function ProjectDTO(id, name) {
        this.id = id;
        this.name = name;
    }

    ProjectDTO.build = function(json) {
        if (angular.isUndefined(json)) {
            return new ProjectDTO(null, '');
        } else {
            return new ProjectDTO(json.id, json.name);
        }
    };
    ProjectDTO.buildNew = function() {
        return new ProjectDTO(uuid.v4(), '');
    };

    ProjectDTO.prototype.isEmpty = function() {
        return angular.isUndefined(this.id) || this.id === null || this.id === '';
    };

    return ProjectDTO;
});