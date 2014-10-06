var cmdBundle = require('../../lib/cmdBundle.js');

describe('command bundle', function() {
	it('should fail when there is no subcommand', function(done) {
		cmdBundle.execute();
		done();
	});
});
