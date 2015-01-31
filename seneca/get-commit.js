module.exports = function getCommit(options) {
	if (!options || !options.database || !options.routing || !options.naming) {
		throw new Error('implementation error')
	}

	options.routing.add({
		get: 'commit'
	}, function(module, done) {
		if (!module || !module.name || !module.sha) {
			done(true, {
				badRequest: true,
				message: 'Must specify module name and sha: {name, sha}'
			})
		} else if (!options.naming.moduleNameIsValid(module.name)) {
			done(true, {
				badRequest: true,
				message: 'Module name is invalid'
			})
		} else {
			options.database.get(module.name + options.naming.separator + module.sha, function(err, commit) {
				if (err) {
					done(true, {
						notFound: true,
						message: 'Error finding module commit "' + module.name + options.naming.separator + module.sha + '"'
					})
				} else {
					done(false, commit)
				}
			})
		}
	})
}
