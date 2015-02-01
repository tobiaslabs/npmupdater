var https = require('https')
var cheerio = require('cheerio')

module.exports = function getNpmModules(username, cb) {
	https.get('https://www.npmjs.com/~' + username, function(res) {
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
			cb(false, modules)
		})
	})
}
