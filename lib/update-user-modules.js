var semver = require('semver')
var modulesOwned = require('npm-owned-modules')
var githubVersion = require('github-module-version')

var npmDetails = require('./npm-module-details')
var pushToNpm = require('./push-commit-to-npm')

module.exports = function UpdateUserModules(emitter) {
	emitter.on('modules:success', function(modules) {
		// modules.forEach(function(module) {
		// 	emitter.emit('module:name', module)
		// })
		emitter.emit('module:name', modules[0])
	})

	emitter.on('module:name', function(module) {
		npmDetails(module, function(err, details) {
			if (err) {
				emitter.emit('details:error', { err: err, module: module })
			} else {
				emitter.emit('details:success', { module: module, npm: details })
			}
		})
	})

	emitter.on('details:success', function(data) {
		githubVersion(data.npm, function(err, githubData) {
			if (err) {
				emitter.emit('github:error', { err: err, module: data.module, npm: data.npm })
			} else {
				emitter.emit('github:success', { module: data.module, npm: data.npm, github: githubData })
			}
		})
	})

	emitter.on('github:success', function(data) {
		if (semver.gt(data.github.properties.version, data.npm.version)) {
			emitter.emit('module:update', data)
		} else {
			emitter.emit('module:checked', data)
		}
	})

	emitter.on('module:update', function(data) {
		pushToNpm({
			user: data.github.user,
			repo: data.github.user,
			sha: data.github.commit.sha
		}, function(err) {
			if (err) {
				emitter.emit('update:error', { error: err, data: data })
			} else {
				emitter.emit('update:success', data)
			}
		})
	})

	return function updateUserModules(username) {
		modulesOwned(username, function(err, modules) {
			if (err) {
				emitter.emit('modules:error', err)
			} else {
				emitter.emit('modules:success', modules)
			}
		})
	}
}
