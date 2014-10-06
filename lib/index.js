(function(exports) {
	exports.execute = function execute() {
		switch(arguments[0]) {
			case 'bundle':
				require('./cmdBundle.js').execute.apply(null, Array.prototype.slice.call(arguments, 1));
				break;
			case 'help':
				require('./cmdHelp.js').execute();
				break;
			default:
				console.error("No command specified");
				require('./cmdHelp.js').execute();
				break;
		}
	};
}(module.exports));
