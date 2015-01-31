module.exports = function addCommit(options) {
	if (!options || !options.database || !options.routing || !options.naming) {
		throw new Error('implementation error')
	}

	options.routing.add({
		put: 'commit'
	}, function(commit, done) {
		if (!commit || !commit.module || !commit.module.name || !commit.module.version || !commit.sha) {
			done(true, {
				badRequest: true,
				message: 'Must specify commit properties: {module.name, module.version, sha}'
			})
		} else if (!options.naming.moduleNameIsValid(commit.module.name)) {
			done(true, {
				badRequest: true,
				message: 'Module name is invalid'
			})
		} else {
			options.database.put(commit.module.name + options.naming.separator + commit.sha, commit, function(err) {
				console.log('ADDED', commit.module.name + options.naming.separator + commit.sha)
				if (err) {
					done(true, {
						notFound: true,
						message: 'Error adding commit "' + commit.name + '"'
					})
				} else {
					done(false, commit)
				}
			})
		}
	})
}


