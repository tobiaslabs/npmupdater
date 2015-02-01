module.exports = function getJsonBody(req, cb) {
	var body = ''
	req.addListener('data', function(data) {
		body += data
	})
	req.addListener('end', function() {
		try {
			cb(false, JSON.parse(body))
		} catch (e) {
			cb('Request body could not be parsed as valid JSON data.')
		}
	})	
}
