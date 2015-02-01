var https = require('https')
var cheerio = require('cheerio')

module.exports = function getNpmModules(options) {
	if (!options || !options.routing || !options.naming) {
		throw new Error('implementation error')
	}
	options.log = options.log || function(){}

	options.routing.add({
		get: 'npm-modules'
	}, function(get, done) {
		if (!get || !get.username) {
			options.log('debug', 'get-npm-modules', 'badRequest', 'username not specified')
			done(true, {
				badRequest: true,
				message: 'must specify username'
			})
		} else {
			https.get('https://www.npmjs.com/~' + get.username, function(res) {
				options.log('debug', 'get-npm-modules', 'https', 'retrieved page')
				res.setEncoding('utf8')
				res.on('data', function(body) {
					var modules = []
					var $ = cheerio.load(body)
					$('#profile #packages').parent().next().children().each(function(index, element) {
						$(element).children('a').each(function(i, e) {
							var href = $(this).attr('href')
							modules.push(href.replace('/package/', ''))
						})
					})
					options.log('info', 'get-npm-modules', 'data', 'retrieved modules', modules)
					done(false, modules)
				})
			})
		}
	})
}
