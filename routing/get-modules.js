module.exports = function getModules(options) {
	if (!options || !options.database || !options.routing || !options.naming) {
		throw new Error('implementation error')
	}
	options.log = options.log || function(){}

	options.routing.add({
		get: 'modules'
	}, function(ignore, done) {
		options.log('debug', 'get-modules', 'database', 'retrieving module list')
		var modules = []
		var stream = options.database.createKeyStream()
		stream.on('data', function(key) {
			if (options.naming.moduleNameIsValid(key)) {
				modules.push(key)
			}
		})
		stream.on('close', function() {
			done(null, modules)
		})
	})
}
