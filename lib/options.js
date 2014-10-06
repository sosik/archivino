(function(exports) {
	'use strict';

	function Options(def) {
		this._def = def || [];
	}

	/**
	 * Add new definition of known parameters
	 * @param {object defStruct} - definitions of parameter
	 */
	Options.prototype.addDef = function(def) {
		this._def.push(def);
	};

	Options.prototype.parse = function() {
	}

	/**
	 * Find definition of shortcut or parameter name in
	 * in definitions
	 */
	Options.prototype.findDef = function(param) {
		for (let i = 0; i < this._def.length; i++) {

		}
	}

	exports {
		create: function(def) {
			return new Options(def);
		}
	};

}(module.exports));
