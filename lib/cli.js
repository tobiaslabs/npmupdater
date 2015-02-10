var updater = require('npmupdater')

var username = process.argv[2]

console.log('Starting the updater for "' + username + '"')

updater(username, function(logs) {
	logs.forEach(function(log) {
		console.log(log.module + ': ' + (module.error ? module.error : 'success!'))
	})
})
