var http = require('http')
var jsonParser = require('./json-parser')

function parseGithubUrl(url) {
	// git@github.com:sdmp/ftp-core.git
	// https://github.com/sdmp/ftp-core.git
	// https://github.com/sdmp/ftp-core
	var matcher
	if (url.indexOf('https://github.com/') === 0) {
		matcher = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/.exec(url)
	} else if (url.indexOf('git@github.com:') === 0) {
		matcher = /git@github\.com:([^\/]+)\/([^\/]+)\.git/.exec(url)
	}
	return {
		user: matcher[1],
		repo: matcher[2]
	}
}

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
					cb('no repository set in this version')
				} else if (repository.type !== 'git') {
					cb('only "git" repository types are currently supported')
				} else if (!repository.url) {
					cb('no repository url set in this version')
				} else {
					var info = parseGithubUrl(repository.url)
					if (!info.user || !info.repo) {
						cb('could not parse repo url')
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
