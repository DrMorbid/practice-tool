angular
    .module('practiceTool')
    .service('PracticeResultExtractor', function (PracticeResultDTO) {
        this.process = function (practiceResult, limit) {
            var result = new PracticeResultDTO();
            var limitForFast = Math.floor(limit / 2);
            var limitForSlow = Math.floor(limit / 2) + (limit % 2);
            
            result.addPrioritized(practiceResult.prioritized);
            
            var lastPracticedFast = practiceResult.getLastPracticedFastOrdered();
            var extractionResult = extract(lastPracticedFast, limitForFast);
            var lastFoundIndexForFast = extractionResult.lastFoundIndex;
            result.addLastPracticedFast(extractionResult.extractedExercises);
            
            var lastPracticedSlow = practiceResult.getLastPracticedSlowOrdered();
            extractionResult = extract(lastPracticedSlow, limitForSlow);
            var lastFoundIndexForSlow = extractionResult.lastFoundIndex;
            result.addLastPracticedSlow(extractionResult.extractedExercises);
            
            if (lastFoundIndexForFast != null) {
                extractionResult = extract(
                    lastPracticedSlow.slice(limitForSlow, lastPracticedSlow.length),
                    limitForFast,
                    lastFoundIndexForFast
                );
                result.addLastPracticedFast(extractionResult.extractedExercises);
            }
            
            if (lastFoundIndexForSlow != null) {
                extractionResult = extract(
                    lastPracticedFast.slice(limitForFast, lastPracticedFast.length),
                    limitForSlow,
                    lastFoundIndexForSlow
                );
                result.addLastPracticedSlow(extractionResult.extractedExercises);
            }
            
            console.log('Processed Practice Result: result=' + JSON.stringify(result));
            return result;
        };
    
        // ----------
    
        /**
        * @private
        */
        function extract(exercises, limit, alreadyHave) {
            var result = {
                lastFoundIndex : null,
                extractedExercises : []
            };
            
            if (!angular.isUndefined(alreadyHave)) {
                limit = limit - alreadyHave;
            }
            for (var index = 0; index < limit; index++) {
                var nextExercise = exercises[index];
                if (nextExercise) {
                    result.extractedExercises.push(nextExercise);
                } else {
                    result.lastFoundIndex = index;
                    break;
                }
            }
            
            return result;
        }
    });