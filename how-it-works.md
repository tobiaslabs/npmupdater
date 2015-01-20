# use the npm rss to see what's changed for the npmupdater

There isn't an RSS or feed anywhere I can see... :(

# when a module is added, add the rss of the github repo thingy

From the npm docs, you can call this URL for some module:

	 https://registry.npmjs.org/<MODULE>

It will give you back a JSON object, and you can get to the repo like this:

	returnedObject.repository

This returns an object like this:

	{
		"type": "git",
		"url": "http://github.com/<USER>/<REPO>.git"
	}

(The `url` can also be `https` or like `git://github.com/<USER>/<REPO>.git`)

Using some fancy regex the `USER` and `REPO` can be grabbed.

You'll want some sort of status page, so that the user can see why things fail.

# periodically check the rss feed of the github repo

You can use the API as well, probably easier. Use the URL like this:

	https://api.github.com/repos/<USER>/<REPO>/commits?page=1&per_page=1

What you get back is an array with a single object (per_page=1) and that
object has the sha on it like this:

	returnedObject[0].commit.tree.sha

# if it's changed, see if the package.json file has changed

If you're using the API, you can call:

	https://api.github.com/repos/<USER>/<REPO>/git/trees/<SHA>

And it will give you back an object containing the list of changed files.

	returnedObject.tree.forEach(function(obj) {
		if (obj.path === 'package.json') {
			// run the updating mechanism here
		}
	})

# if the package.json has changed push to npmjs


---


# API

## `/module`

### `GET /module ->`

	[
		// module name string literals, e.g. 'ftp-core' or 'path'
	]

### `GET /module/{:moduleName} ->`

	{
		owned: {
			first: 'date {:moduleName} was owned',
			checked: 'most recent date {:moduleName} was confirmed to be owned'
		},
		module: {
			name: 'name of module, equivalent to {:moduleName}',
			version: 'semver of module as found on npm',
			repository: {
				type: 'currently "git", maybe "svn" will be supported later',
				url: 'url to the repo'
			}
		},
		history: [
			// commit sha string literals, e.g. '31ed499331769aaf6619ac90245ef00985988a5c'
		]
	}

### `PUT /module/{:moduleName} <-` (create or replace)

	{
		name: 'name of module, equivalent to {:moduleName}',
		version: 'semver of module as found on npm',
		repository: {
			type: 'currently "git", maybe "svn" will be supported later',
			url: 'url to the repo'
		}
	}

	200: when module already existed and is now updated
	201: when module is added
	400: bad data
	401: unauthorized to add module

### `DELETE /module/{:moduleName} ->`

	Returns the status code, no data

	200: when module is deleted
	400: bad data
	401: unauthorized to delete module

### `GET /module/{:moduleName}/{:sha} ->`

	{
		added: 'date the commit was added',
		sha: 'the sha for this commit, equivalent to {:sha}',
		pushed: '(optional) date the repo was pushed to npm at this version',
		version: 'semver as found in the package.json of this commit',
		files: [
			// file name string literals, e.g. 'path/to/file.ext'
		]
	}

### `PUT /module/{:moduleName}/{:sha} <-`

	{
		version: 'semver as found in the package.json of this commit',
		files: [
			// file name string literals, e.g. 'path/to/file.ext'
		]
	}

	200: when commit already existed and is now updated
	201: when commit is added
	400: bad data
	401: unauthorized to add commit

### `DELETE /module/{:moduleName}/{:sha} ->`

	Returns the status code, no data

	200: when commit is deleted
	400: bad data
	401: unauthorized to delete commit

### `POST /update <-`

	{
		module: 'name of module, e.g. "ftp-core"',
		repository: {
			type: 'currently "git", maybe "svn" will be supported later',
			url: 'url to the repo'
		},
		sha: 'commit sha to push to npm'
	}

	200: when update is posted
	401: unauthorized to initiate update

### `GET /update/{:moduleName}/{:sha} ->`

	{
		started: 'date the process was started',
		finished: 'date the process was finished',
		result: 'status returned from npm after pushing',
		log: 'the log string as given by npm on issuing push (for debugging, mostly)'
	}



































