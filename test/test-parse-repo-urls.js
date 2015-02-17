var test = require('tape')
var parseUrl = require('../lib/parse-repo-url')

test('github repo urls', function(t) {
	var urls = [
		parseUrl('git@github.com:tobiaslabs/npmupdater.git'),
		parseUrl('git://github.com/tobiaslabs/npmupdater.git'),
		parseUrl('https://github.com/tobiaslabs/npmupdater.git'),
		parseUrl('https://github.com/tobiaslabs/npmupdater')
	]
	urls.forEach(function(url) {
		t.equal(url.user, 'tobiaslabs', 'user names are parsed')
		t.equal(url.repo, 'npmupdater', 'repo names are parsed')
	})
	t.end()
})
