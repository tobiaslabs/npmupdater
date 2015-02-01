var level = require('level-mem')
var seneca = require('seneca')()

var GetRecentCommits = require('./lib/get-recent-commits')
var getModuleDetails = require('./lib/get-module-details')
var getRecentCommit = require('./lib/get-recent-commit')
var updateModulesOwned = require('./lib/update-modules-owned')
var pushToNpm = require('./lib/push-commit-to-npm')

var addCommit = require('./routing/add-commit')
var addModule = require('./routing/add-module')
var getCommit = require('./routing/get-commit')
var getModule = require('./routing/get-module')
var getModules = require('./routing/get-modules')
var getNpmModules = require('./lib/get-npm-modules')
var removeCommit = require('./routing/remove-commit')
var removeModule = require('./routing/remove-module')

var options = {
	routing: seneca,
	database: level('npmupdater', {
		keyEncoding: 'utf8',
		valueEncoding: 'json'
	}),
	naming: {
		separator: '/',
		moduleNameIsValid: function moduleNameIsValid(string) {
			return string.indexOf('/') < 0
		}
	},
	log: console.log
}
addCommit(options)
addModule(options)
getCommit(options)
getModule(options)
getModules(options)
removeCommit(options)
removeModule(options)

var getCommitsForModules = new GetRecentCommits(options)

options.config = {
	token: 'abc123lolbutts',
	username: 'npmupdater',
	delayRefreshModules: 1000*60,
	delayRefreshGithub: 1000*60
}
options.getUserModules = getUserModules
options.getModuleDetails = getModuleDetails

function updateModules() {
	options.routing.client().act({
		get: 'modules'
	}, function(err, modules) {
		if (!err) {
			options.watchedModules = modules
			updateModulesOwned(options, function() {
				options.log('debug', 'index', 'timeout', 'setting timeout for updateModules in: ' + options.config.delayRefreshModules)
				setTimeout(updateModules, options.config.delayRefreshModules)
			})
		} else {
			options.log('debug', 'index', 'timeout', 'setting timeout for updateModules in: ' + options.config.delayRefreshModules)
			setTimeout(updateModules, options.config.delayRefreshModules)
		}
	})
}
updateModules()

function updateGithubCommits() {
	options.routing.client().act({
		get: 'modules'
	}, function(err, modules) {
		if (!err) {
			getCommitsForModules(modules, function() {
				options.log('debug', 'index', 'timeout', 'setting timeout for updateGithubCommits in: ' + options.config.delayRefreshGithub)
				setTimeout(updateGithubCommits, options.config.delayRefreshGithub)
			})
		} else {
			options.log('debug', 'index', 'timeout', 'setting timeout for updateGithubCommits in: ' + options.config.delayRefreshGithub)
			setTimeout(updateGithubCommits, options.config.delayRefreshGithub)
		}
	})
}
updateGithubCommits()
