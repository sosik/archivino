(function(exports) {
	exports.execute = function execute() {
		console.info('Archivino');
		console.info('archivino <command> [<subcommand>] [<arguments>]');
		console.info('help\t\t\t\t\t\t print this screen');
		console.info('bundle\t\t\t\t\t\t bundle manipulations');
		console.info(' create <outfile> [<infile> <infile> ...]\t created bundle');
	};
}(module.exports));
