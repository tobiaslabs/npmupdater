module.exports = function removeModule(options) {
	if (!options || !options.database || !options.routing || !options.naming) {
		throw new Error('implementation error')
	}

	options.routing.add({
		remove: 'module'
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
			options.database.del(module.name, function(err) {
				if (err) {
					done(true, {
						notFound: true,
						message: 'Error deleting module "' + module.name + '"'
					})
				} else {
					// TODO: get stream of commits for module, then use seneca to delete them
					done(false)
				}
			})
		}
	})
}
