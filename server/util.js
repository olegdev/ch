/**
 * Утилиты
 */
var q = require('q');

module.exports = {

	whenAll: function(deferreds) {
		var deferred = q.defer(),
			count = deferreds.length,
			resolved = 0;

		if (count) {
			for(var i = 0; i < count; i++) {
				deferreds[i].then(function() {
					if (++resolved == count) {
						deferred.resolve();
					}
				});
			}
		} else {
			deferred.resolve();
		}

		return deferred.promise;
	}

};