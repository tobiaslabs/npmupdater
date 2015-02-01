var test = require('tape')
var updateModulesOwned = require('../lib/update-modules-owned')

function getDefaultOptions() {
	return {
		config: {
			username: 'bob',
			token: 'butts'
		}
	}	
}

test('that it works', function(t) {
	var options = getDefaultOptions()
	options.watchedModules = [ 'a', 'c' ]
	var newModules = {
		b: {
			name: 'b',
			version: '0.0.0',
			user: 'bob',
			repo: 'lol'
		}
	}
	options.getUserModules = function(username, cb) {
		cb(false, [ 'a', 'b' ])
	}
	options.getModuleDetails = function(module, cb) {
		if (newModules[module]) {
			cb(false, newModules[module])
		} else {
			cb(true)
		}
	}
	options.routing = {
		client: function() {
			return {
				act: function(obj, cb) {
					if (obj.put) {
						options.watchedModules.push(obj.name)
					} else if (obj.remove) {
						var i = options.watchedModules.indexOf(obj.name)
						options.watchedModules.splice(i, i)
					}
					cb()
				}
			}
		}
	}
	updateModulesOwned(options, function() {
		t.ok(options.watchedModules.indexOf('a') >= 0, '"a" should exist')
		t.ok(options.watchedModules.indexOf('b') >= 0, '"b" should exist')
		t.ok(options.watchedModules.indexOf('c') < 0, '"c" should not exist')
		t.end()
	})
})
