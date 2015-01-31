module.exports = function getModules(options) {
	if (!options || !options.database || !options.routing || !options.naming) {
		throw new Error('implementation error')
	}

	options.routing.add({
		get: 'modules'
	}, function(ignore, done) {
		var modules = []
		var stream = options.database.createKeyStream()
		stream.on('data', function(key) {
			if (options.moduleNameIsValid(key)) {
				modules.push(key)
			}
		})
		stream.on('close', function() {
			done(null, modules)
		})
	})
}
