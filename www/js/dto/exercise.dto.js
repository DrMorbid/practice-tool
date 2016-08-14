angular.module('practiceTool').factory(
        'ExerciseDTO',
        function(uuid, TEMPO, TEMPO_TYPE) {
            function ExerciseDTO(id, projectId, name, active, prioritized, slowTempo, fastTempo, lastPracticed,
                    lastPracticedTempo) {
                this.id = id;
                this.projectId = projectId;
                this.name = name;
                this.active = active;
                this.prioritized = prioritized;
                this.slowTempo = slowTempo;
                this.fastTempo = fastTempo;
                this.lastPracticed = lastPracticed;
                this.lastPracticedTempo = lastPracticedTempo;
            }

            ExerciseDTO.build = function(json) {
                if (angular.isUndefined(json)) {
                    return new ExerciseDTO(null, null, '', 0, 0, null, null, null, null);
                } else {
                    return new ExerciseDTO(json.id, json.projectId, json.name, json.active === 1 ? true : false,
                            json.prioritized === 1 ? true : false, TEMPO.getByEnumValue(json.slowTempo), TEMPO
                                    .getByEnumValue(json.fastTempo), new Date(json.lastPracticed), TEMPO_TYPE
                                    .getByEnumValue(json.lastPracticedTempo));
                }

            };
            ExerciseDTO.buildNew = function(projectId, lastPracticedTempo) {
                return new ExerciseDTO(uuid.v4(), projectId, '', true, false, TEMPO.getDefaultSlow(), TEMPO
                        .getDefaultFast(), null, lastPracticedTempo);
            };

            ExerciseDTO.prototype.toEntity = function() {
                this.active = this.active ? 1 : 0;
                this.prioritized = this.prioritized ? 1 : 0;
                this.slowTempo = this.slowTempo.enumValue;
                this.fastTempo = this.fastTempo.enumValue;
                //this.lastPracticed = this.lastPracticed ? this.lastPracticed.toISOString().substring(0, 10) : this.lastPracticed;
                this.lastPracticedTempo = this.lastPracticedTempo.enumValue;
            };

            ExerciseDTO.prototype.isEmpty = function() {
                return angular.isUndefined(this.id) || this.id === null || this.id === '';
            };

            return ExerciseDTO;
        });