module.exports = function getModule(options) {
	if (!options || !options.database || !options.routing || !options.naming) {
		throw new Error('implementation error')
	}

	options.routing.add({
		get: 'module'
	}, function(module, done) {
		if (!module || !module.name) {
			done(true, {
				badRequest: true,
				message: 'Must specify module name: {name:"my-module"}'
			})
		} else if (!options.naming.moduleNameIsValid(module.name)) {
			done(true, {
				badRequest: true,
				message: 'Module name is invalid'
			})
		} else {
			options.database.get(module.name, function(err, m) {
				if (err) {
					done(true, {
						notFound: true,
						message: 'Error finding module "' + module.name + '"'
					})
				} else {
					done(false, m)
				}
			})
		}
	})
}
