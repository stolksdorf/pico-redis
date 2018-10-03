const test = require('pico-check');
const storage = require('../pico-redis.js');

const wait = (time=200)=>new Promise((resolve, reject)=>setTimeout(resolve, time));

test('Setup', async (t)=>{
	await storage.connect();
	await storage.clear();
	t.is(await storage.get('cool'), undefined);
});


test('Storing values', async (t)=>{
	await storage.set('cool', 6)
	t.is(await storage.get('cool'), 6);
});


test('Storing values with expiry', async (t)=>{
	await storage.set('with_expiry', true, 1);
	await wait(200);
	t.is(await storage.get('with_expiry'), true);
	await wait(1800);
	t.is(await storage.get('with_expiry'), undefined);
}, {timeout : 3000});


test('Storing complex values', async (t)=>{
	const init_val = {
		cool : true,
		foo : [5, "okay this is a test", false],
		fancy : {
			doot : "test"
		}
	};
	await storage.set('complex', init_val)
	t.is(await storage.get('complex'), init_val);
});


test('Accessing scoped values', async (t)=>{
	const scoped = storage.scope('base');
	await scoped.set('scoped', 100)
	t.is(await scoped.get('scoped'), 100)
	t.is(await storage.get('scoped'), undefined);
	t.is(await storage.get('base|scoped'), 100);
});


test('can delete key', async (t)=>{
	await storage.set('delete', true);
	t.is(await storage.get('delete'), true)
	await storage.del('delete');
	t.is(await storage.get('delete'), undefined)
});


// test.skip('keys', async (t)=>{

// });


test('can create separate clients', async (t)=>{
	const scoped = storage.scope('separate');
	t.is(storage.client(), scoped.client());
	await scoped.connect();
	t.not(storage.client(), scoped.client());
	await scoped.close();
});

test('clean up', async (t)=>{
	await storage.clear();
	await storage.close();
});

module.exports = test;