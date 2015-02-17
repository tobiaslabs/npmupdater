var http = require('http')
var jsonParser = require('./json-parser')
var parseRepoUrl = require('./parse-repo-url')

module.exports = function getModuleDetails(moduleName, cb) {
	http.get('http://registry.npmjs.org/' + moduleName, function(res) {
		jsonParser(res, function(err, json) {
			if (err) {
				cb(err)
			} else {
				var module = {
					name: json.name,
					version: json['dist-tags'].latest
				}
				var repository = json.versions[module.version].repository
				if (!repository) {
					cb({ noRepo: 'no repository set in this version' })
				} else if (repository.type !== 'git') {
					cb({ unsupportedRepo: 'only "git" repository types are currently supported' })
				} else if (!repository.url) {
					cb({ noRepoUrl: 'no repository url set in this version' })
				} else {
					var info = parseRepoUrl(repository.url)
					if (!info.user || !info.repo) {
						cb({ badRepoUrl: 'could not parse repo url' })
					} else {
						module.user = info.user
						module.repo = info.repo
						cb(false, module)
					}
				}
			}
		})
	})
}
