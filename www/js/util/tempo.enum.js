angular.module('practiceTool').constant('TEMPO', {
    extremelySlow : {
        enumValue : 'extremelySlow',
        label : '25 %'
    },
    verySlow : {
        enumValue : 'verySlow',
        label : '50 %'
    },
    slow : {
        enumValue : 'slow',
        label : '75 %'
    },
    full : {
        enumValue : 'full',
        label : '100 %'
    },
    fast : {
        enumValue : 'fast',
        label : '125 %'
    },

    getAllTempos : function() {
        return [ this.extremelySlow, this.verySlow, this.slow, this.full, this.fast ];
    },
    getDefaultSlow : function() {
        return this.slow;
    },
    getDefaultFast : function() {
        return this.full;
    },
    getByEnumValue : function(enumValue) {
        return this[enumValue];
    }
});