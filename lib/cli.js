#!/usr/bin/env node

var updater = require('npmupdater')

var username = process.argv[2]

console.log('Starting the updater for "' + username + '"')

updater(username, function(logs) {
	if (!logs) {
		console.log('No logs available.')
	} else {
		logs.forEach(function(log) {
			console.log(log.module + ': ' + (module.error ? module.error : 'success!'))
		})
	}
})
