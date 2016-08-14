angular.module('practiceTool').constant('TEMPO_TYPE', {
    slow : {
        enumValue : 'slow',
        label : 'Slow Tempo'
    },
    fast : {
        enumValue : 'fast',
        label : 'Fast Tempo'
    },

    getAllTempoTypes : function() {
        return [ this.slow, this.fast ];
    },
    getByEnumValue : function(enumValue) {
        return this[enumValue];
    },
    getOpposite : function(tempoType) {
        var result = this.slow;

        if (tempoType === this.slow) {
            result = this.fast;
        }

        return result;
    }
});