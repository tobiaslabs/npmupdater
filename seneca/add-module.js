module.exports = function addModule(options) {
	if (!options || !options.database || !options.routing || !options.naming) {
		throw new Error('implementation error')
	}

	options.routing.add({
		put: 'module'
	}, function(module, done) {
		if (!module || !module.name || !module.version || !module.repository || !module.repository.type || !module.repository.url) {
			done(true, {
				badRequest: true,
				message: 'Must specify module properties: {name, version, repository.type, repository.url}'
			})
		} else if (!options.naming.moduleNameIsValid(module.name)) {
			done(true, {
				badRequest: true,
				message: 'Module name is not valid'
			})
		} else {
			var obj = {
				owned: {
					first: new Date()
				},
				module: module,
				history: []
			}
			options.database.put(module.name, obj, function(err) {
				if (err) {
					done(true, {
						notFound: true,
						message: 'Error adding module "' + module.name + '"'
					})
				} else {
					done(false, obj)
				}
			})
		}
	})
}
