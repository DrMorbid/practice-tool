describe('CONSTANTS', function() {
    var CONSTANTS;

    beforeEach(module('practiceTool'));

    beforeEach(inject(function(_CONSTANTS_) {
        CONSTANTS = _CONSTANTS_;
    }));

    describe('Fields', function() {
        it('check if all fields are present', function() {
            expect(CONSTANTS.ORDER_BY).toBeDefined();
            expect(CONSTANTS.EXERCISE_COMPARATOR).toBeDefined();
        });
    });
});
