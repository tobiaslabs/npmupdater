module.exports = function getModule(options) {
	if (!options || !options.database || !options.routing || !options.naming) {
		throw new Error('implementation error')
	}
	options.log = options.log || function(){}

	options.routing.add({
		get: 'module'
	}, function(module, done) {
		if (!module || !module.name) {
			options.log('debug', 'get-module', 'badRequest', 'module name not specified')
			done(true, {
				badRequest: true,
				message: 'Must specify module name: {name:"my-module"}'
			})
		} else if (!options.naming.moduleNameIsValid(module.name)) {
			options.log('debug', 'get-module', 'badRequest', 'module name invalid: "' + module.name + '"')
			done(true, {
				badRequest: true,
				message: 'Module name is invalid'
			})
		} else {
			options.database.get(module.name, function(err, m) {
				if (err) {
					options.log('debug', 'get-module', 'database', 'error accessing database for module: "' + module.name + '"')
					done(true, {
						notFound: true,
						message: 'Error finding module "' + module.name + '"'
					})
				} else {
					options.log('debug', 'get-module', 'database', 'success retrieving module: "' + module.name + '"')
					done(false, m)
				}
			})
		}
	})
}
