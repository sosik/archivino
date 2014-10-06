(function(exports) {
	'use strict';

	exports.execute = function execute() {
		var args = Array.prototype.slice.call(arguments);

		switch (args[0]) {
			case 'create':
				var files = args.call(1);

				if (files.length < 1) {
					console.error('There has to be at least one file to bundle');
					return -1;
				}

				var i = 0;
				for (i = 0; i < files.length; i++) {
				}
				break;
			default:
				console.error("Missing or unknown subcommand for bundle");
				require('./cmdHelp.js').execute();
				break;
		}
	};
}(module.exports));
