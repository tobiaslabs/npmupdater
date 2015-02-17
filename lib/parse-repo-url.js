module.exports = function parseRepoUrl(url) {
	// currently only github repos are supported :-(
	var matcher
	if (url.indexOf('https://github.com/') === 0) {
		if (url.indexOf('.git') === url.length - 4) {
			matcher = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)\.git/.exec(url)
		} else {
			matcher = /https:\/\/github\.com\/([^\/]+)\/([^\/]+)?/.exec(url)
		}
	} else if (url.indexOf('git@github.com:') === 0) {
		matcher = /git@github\.com:([^\/]+)\/([^\/]+)\.git/.exec(url)
	} else if (url.indexOf('git://') === 0) {
		matcher = /git:\/\/github\.com\/([^\/]+)\/([^\/]+)\.git/.exec(url)
	}
	return {
		user: matcher[1],
		repo: matcher[2]
	}
}
