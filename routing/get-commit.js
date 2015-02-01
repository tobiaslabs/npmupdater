module.exports = function getCommit(options) {
	if (!options || !options.database || !options.routing || !options.naming) {
		throw new Error('implementation error')
	}
	options.log = options.log || function(){}

	options.routing.add({
		get: 'commit'
	}, function(module, done) {
		if (!module || !module.name || !module.sha) {
			options.log('debug', 'get-commit', 'badRequest', 'commit not specified')
			done(true, {
				badRequest: true,
				message: 'Must specify module name and sha: {name, sha}'
			})
		} else if (!options.naming.moduleNameIsValid(module.name)) {
			options.log('debug', 'get-commit', 'badRequest', 'invalid module name: "' + module.name + "'")
			done(true, {
				badRequest: true,
				message: 'Module name is invalid'
			})
		} else {
			options.database.get(module.name + options.naming.separator + module.sha, function(err, commit) {
				if (err) {
					options.log('debug', 'get-commit', 'database', 'error accessing database for commit: "' + module.name + options.naming.separator + module.sha + '"')
					done(true, {
						notFound: true,
						message: 'Error finding module commit "' + module.name + options.naming.separator + module.sha + '"'
					})
				} else {
					options.log('debug', 'get-commit', 'database', 'retrieved commit: "' + module.name + options.naming.separator + module.sha + '"')
					done(false, commit)
				}
			})
		}
	})
}
