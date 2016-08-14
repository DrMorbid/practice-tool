angular
    .module('practiceTool')
    .factory('PracticeResultDTO', function ($filter, CONSTANTS) {
        function PracticeResultDTO() {
            this.prioritized = [];
            this.lastPracticedFast = [];
            this.lastPracticedSlow = [];
        }
    
        PracticeResultDTO.prototype.addPrioritized = function (prioritizedExercise) {
            if (Array.isArray(prioritizedExercise)) {
                this.prioritized = this.prioritized.concat(prioritizedExercise);
            } else {
                this.prioritized.push(prioritizedExercise);
            }
        };
        PracticeResultDTO.prototype.addLastPracticedFast = function (exerciseLastPracticedFast) {
            if (Array.isArray(exerciseLastPracticedFast)) {
                this.lastPracticedFast = this.lastPracticedFast.concat(exerciseLastPracticedFast);
            } else {
                this.lastPracticedFast.push(exerciseLastPracticedFast);
            }
        };
        PracticeResultDTO.prototype.addLastPracticedSlow = function (exerciseLastPracticedSlow) {
            if (Array.isArray(exerciseLastPracticedSlow)) {
                this.lastPracticedSlow = this.lastPracticedSlow.concat(exerciseLastPracticedSlow);
            } else {
                this.lastPracticedSlow.push(exerciseLastPracticedSlow);
            }
        };
        PracticeResultDTO.prototype.getPrioritizedOrdered = function () {
            return $filter(CONSTANTS.ORDER_BY)(this.prioritized, CONSTANTS.EXERCISE_COMPARATOR);
        };
        PracticeResultDTO.prototype.getLastPracticedFastOrdered = function () {
            return $filter(CONSTANTS.ORDER_BY)(this.lastPracticedFast, CONSTANTS.EXERCISE_COMPARATOR);
        };
        PracticeResultDTO.prototype.getLastPracticedSlowOrdered = function () {
            return $filter(CONSTANTS.ORDER_BY)(this.lastPracticedSlow, CONSTANTS.EXERCISE_COMPARATOR);
        };
    
        return PracticeResultDTO;
    });
