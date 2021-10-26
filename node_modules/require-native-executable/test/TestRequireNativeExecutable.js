const expect = require('chai').expect;
const {requireNativeExecutable, requireNativeExecutableSync, NativeExecutableMissingError} = require('../index');

describe('require-native-executable', function () {
    describe('requireNativeExecutableSync', function () {
        it('should not throw for the node executable', async function () {
            expect(function() {
                requireNativeExecutableSync('node');
            }).to.not.throw();
        });
        it('should throw for a non-existing executable', async function () {
            expect(function() {
                requireNativeExecutableSync('qqjqiezu104t01jqjq104izhh01z1h1heh1eh1');
            }).to.throw(NativeExecutableMissingError);
        });
    });
});
