module.exports = function GetCommit(options){
	return {
		required: {
			name: 'string',
			sha: 'string'
		},
		authenticate: false,
		route: {
			get: 'commit'
		},
		response: function(module, done) {
			var name = module.name + options.naming.separator + module.sha
			options.database.get(name, function(err, commit) {
				if (err) {
					done(true, {
						notFound: true,
						message: 'Error finding module commit "' + name + '"'
					})
				} else {
					done(false, commit)
				}
			})
		}
	}
}
