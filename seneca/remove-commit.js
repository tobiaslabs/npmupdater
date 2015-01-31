module.exports = function removeCommit(options) {
	if (!options || !options.database || !options.routing || !options.naming) {
		throw new Error('implementation error')
	}

	options.routing.add({
		remove: 'commit'
	}, function(commit, done) {
		if (!commit || !commit.module || !commit.sha) {
			done(true, {
				badRequest: true,
				message: 'Must specify module name and sha: {module:"my-module", sha:"cd9281..."}'
			})
		} else if (!options.naming.moduleNameIsValid(commit.module)) {
			done(true, {
				badRequest: true,
				message: 'Module name is invalid'
			})
		} else {
			options.database.del(commit.module + options.naming.separator + commit.sha, function(err) {
				if (err) {
					done(true, {
						notFound: true,
						message: 'Error deleting commit "' + commit.module + options.naming.separator + commit.sha + '"'
					})
				} else {
					done(false)
				}
			})
		}
	})
}
