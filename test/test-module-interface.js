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

test('getting an empty module list', function(t) {
	var modInterface = new ModuleInterface(database())
	modInterface.getModuleList(function(modules) {
		t.ok(modules, 'it should give you back the modules')
		t.ok(Array.isArray(modules), 'it should be an array')
		t.equal(0, modules.length, 'it should have zero items')
		t.end()
	})
})

test('adding a module without the required parameters', function(t) {
	var modInterface = new ModuleInterface(database())
	modInterface.putModule({}, function(err, module) {
		t.ok(err, 'adding a module requires fields')
		t.end()
	})
})

test('adding a module with a forward slash', function(t) {
	var modInterface = new ModuleInterface(database())
	modInterface.putModule({
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
	var modInterface = new ModuleInterface(database())
	var inserted = {
		name: 'module',
		version: '0.0.0',
		repository: {
			type: 'git',
			url: 'site.com/repo.git'
		}
	}
	modInterface.putModule(inserted, function(err, module) {
		t.notOk(err, 'module should be inserted')
		t.ok(module.owned.first, 'it should have the first owned date added')
		t.equal(module.module, inserted, 'the inserted module should be unchanged')
		t.end()
	})
})

test('an added module should be persisted', function(t) {
	var modInterface = new ModuleInterface(database())
	var inserted = {
		name: 'module',
		version: '0.0.0',
		repository: {
			type: 'git',
			url: 'site.com/repo.git'
		}
	}
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
	var modInterface = new ModuleInterface(database())
	var inserted = {
		name: 'module',
		version: '0.0.0',
		repository: {
			type: 'git',
			url: 'site.com/repo.git'
		}
	}
	modInterface.putModule(inserted, function(err, module) {
		t.notOk(err, 'module should be inserted')
		modInterface.deleteModule(inserted.name, function(err) {
			t.notOk(err, 'deleting existing module should not throw error')
			t.end()
		})
	})
})

test('deleting a module should persist the data change', function(t) {
	var modInterface = new ModuleInterface(database())
	var inserted = {
		name: 'module',
		version: '0.0.0',
		repository: {
			type: 'git',
			url: 'site.com/repo.git'
		}
	}
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








/*
test('adding a module', function(t) {
	var db = level('contains_some', {
		keyEncoding: 'utf8',
		valueEncoding: 'json'
	})
	var modInterface = new ModuleInterface(db)
	t.plan(20)

	modInterface.putModule({}, function(err, module) {
		t.ok(err, 'adding a module requires fields')
	})

	modInterface.putModule({
		name: 'my/module',
		version: '0.0.0',
		repository: {
			type: 'git',
			url: 'site.com/repo.git'
		}
	}, function(err, module) {
		t.ok(err, 'module name may not contain a forward slash')
	})

	var inserted = {
		name: 'module',
		version: '0.0.0',
		repository: {
			type: 'git',
			url: 'site.com/repo.git'
		}
	}
	modInterface.putModule(inserted, function(err, module) {
		t.notOk(err, 'module should be inserted')
		t.ok(module.owned.first, 'it should have the first owned date added')
		t.equal(module.module, inserted, 'the inserted module should be unchanged')
	})
	modInterface.getModule(inserted.name, function(err, module) {
		t.notOk(err, 'the module should have been inserted')
		t.deepEqual(module.module, inserted)
		t.ok(module.owned.first, 'it should have the first owned date added')
	})
	modInterface.getModuleList(function(modules) {
		t.ok(modules, 'it should give you back the modules')
		t.ok(Array.isArray(modules), 'it should be an array')
		t.equal(1, modules.length, 'it should have one module')
		t.equal(modules[0], inserted.name, 'the one module should have the correct name')
	})
	modInterface.deleteModule(inserted.name, function(err) {
		t.notOk(err, 'deleting existing module should not throw error')
	})
	modInterface.getModule(inserted.name, function(err) {
		t.ok(err, 'the module should not exist')
	})
	modInterface.getModuleList(function(modules) {
		t.ok(modules, 'it should give you back the modules')
		t.ok(Array.isArray(modules), 'it should be an array')
		t.equal(0, modules.length, 'it should have zero items')
	})

})
*/






