var test = require('tape')
var level = require('level-mem')
var uuid = require('uuidv4')
var ModuleInterface = require('../lib/module-interface.js')

function database() {
	var uuidSoThatEachLevelMemDatabaseIsUnique = uuid()
	return level(uuidSoThatEachLevelMemDatabaseIsUnique, {
		keyEncoding: 'utf8',
		valueEncoding: 'json'
	})
}

function modInterface() {
	return new ModuleInterface(database())
}

test('getting an empty module list', function(t) {
	modInterface().getModuleList(function(modules) {
		t.ok(modules, 'it should give you back the modules')
		t.ok(Array.isArray(modules), 'it should be an array')
		t.equal(0, modules.length, 'it should have zero items')
		t.end()
	})
})

test('adding a module without the required parameters', function(t) {
	modInterface().putModule({}, function(err, module) {
		t.ok(err, 'adding a module requires fields')
		t.end()
	})
})

test('adding a module with a forward slash', function(t) {
	modInterface().putModule({
		name: 'my/module',
		version: '0.0.0',
		repository: {
			type: 'git',
			url: 'site.com/repo.git'
		}
	}, function(err, module) {
		t.ok(err, 'module name may not contain a forward slash')
		t.end()
	})
})

test('adding a module correctly returns appropriate values', function(t) {
	var inserted = {
		name: 'module',
		version: '0.0.0',
		repository: {
			type: 'git',
			url: 'site.com/repo.git'
		}
	}
	modInterface().putModule(inserted, function(err, module) {
		t.notOk(err, 'module should be inserted')
		t.ok(module.owned.first, 'it should have the first owned date added')
		t.equal(module.module, inserted, 'the inserted module should be unchanged')
		t.end()
	})
})

test('an added module should be persisted', function(t) {
	var inserted = {
		name: 'module',
		version: '0.0.0',
		repository: {
			type: 'git',
			url: 'site.com/repo.git'
		}
	}
	var modInterface = new ModuleInterface(database())
	modInterface.putModule(inserted, function(err, module) {
		t.notOk(err, 'module should be inserted')
		modInterface.getModule(inserted.name, function(err, module) {
			t.notOk(err, 'the module should have been inserted')
			t.deepEqual(module.module, inserted)
			t.ok(module.owned.first, 'it should have the first owned date added')
			modInterface.getModuleList(function(modules) {
				t.ok(modules, 'it should give you back the modules')
				t.ok(Array.isArray(modules), 'it should be an array')
				t.equal(1, modules.length, 'it should have one module')
				t.equal(modules[0], inserted.name, 'the one module should have the correct name')
				t.end()
			})
		})
	})
})

test('deleting a module should return correct errors', function(t) {
	var inserted = {
		name: 'module',
		version: '0.0.0',
		repository: {
			type: 'git',
			url: 'site.com/repo.git'
		}
	}
	var modInterface = new ModuleInterface(database())
	modInterface.putModule(inserted, function(err, module) {
		t.notOk(err, 'module should be inserted')
		modInterface.deleteModule(inserted.name, function(err) {
			t.notOk(err, 'deleting existing module should not throw error')
			t.end()
		})
	})
})

test('deleting a module should persist the data change', function(t) {
	var inserted = {
		name: 'module',
		version: '0.0.0',
		repository: {
			type: 'git',
			url: 'site.com/repo.git'
		}
	}
	var modInterface = new ModuleInterface(database())
	modInterface.putModule(inserted, function(err, module) {
		t.notOk(err, 'module should be inserted')
		modInterface.deleteModule(inserted.name, function(err) {
			t.notOk(err, 'deleting existing module should not throw error')
			modInterface.getModule(inserted.name, function(err) {
				t.ok(err, 'the module should not exist')
				modInterface.getModuleList(function(modules) {
					t.ok(modules, 'it should give you back the modules')
					t.ok(Array.isArray(modules), 'it should be an array')
					t.equal(0, modules.length, 'it should have zero items')
					t.end()
				})
			})
		})
	})
})

test('getting a commit without required parameters', function(t) {
	modInterface().getModuleCommit({}, function(err) {
		t.ok(err, 'it should throw an error')
		t.equal(err.status, 400, 'it should throw a 400 error')
		t.end()
	})
})

test('getting a non existant commit', function(t) {
	var commitObject = {
		module: 'doesNotExist',
		sha: 'fake'
	}
	modInterface().getModuleCommit(commitObject, function(err) {
		t.ok(err, 'it should throw an error')
		t.equal(err.status, 404, 'if the commit does not exist it should return 404')
		t.end()
	})
})

test('adding a commit without the required parameters', function(t) {
	modInterface().putModuleCommit({}, function(err) {
		t.ok(err, 'adding a module requires fields')
		t.equal(err.status, 400, 'it should throw the correct error')
		t.end()
	})
})

test('adding a commit with an empty file list', function(t) {
	modInterface().putModuleCommit({
		name: 'module',
		sha: 'abc123',
		version: '0.0.0',
		files: []
	}, function(err) {
		t.ok(err, 'empty file list is invalid')
		t.equal(err.status, 400, 'it should throw the correct error')
		t.end()
	})
})

test('adding a commit with a file list containing non-strings', function(t) {
	modInterface().putModuleCommit({
		name: 'module',
		sha: 'abc123',
		version: '0.0.0',
		files: [ {}, 'file', 9001 ]
	}, function(err) {
		t.ok(err, 'all files in list must be strings')
		t.equal(err.status, 400, 'it should throw the correct error')
		t.end()
	})
})

test('adding a commit correctly returns appropriate values', function(t) {
	modInterface().putModuleCommit({
		name: 'module',
		sha: 'abc123',
		version: '0.0.0',
		files: [ 'file1.ext', 'file2.ext' ]
	}, function(err, commit) {
		t.notOk(err, 'should not throw an error')
		t.ok(commit.added, 'there should be a date here')
		t.end()
	})
})

// test('adding a module with a forward slash', function(t) {
// 	modInterface().putModule({
// 		name: 'my/module',
// 		version: '0.0.0',
// 		repository: {
// 			type: 'git',
// 			url: 'site.com/repo.git'
// 		}
// 	}, function(err, module) {
// 		t.ok(err, 'module name may not contain a forward slash')
// 		t.end()
// 	})
// })

// test('adding a module correctly returns appropriate values', function(t) {
// 	var inserted = {
// 		name: 'module',
// 		version: '0.0.0',
// 		repository: {
// 			type: 'git',
// 			url: 'site.com/repo.git'
// 		}
// 	}
// 	modInterface().putModule(inserted, function(err, module) {
// 		t.notOk(err, 'module should be inserted')
// 		t.ok(module.owned.first, 'it should have the first owned date added')
// 		t.equal(module.module, inserted, 'the inserted module should be unchanged')
// 		t.end()
// 	})
// })








/*
 `GET /module/{:moduleName}/{:sha} ->`

	{
		pulled: 'date the commit was added',
		sha: 'the sha for this commit, equivalent to {:sha}',
		pushed: '(optional) date the repo was pushed to npm at this version',
		version: 'semver as found in the package.json of this commit',
		files: [
			// file name string literals, e.g. 'path/to/file.ext'
		]
	}
*/


























