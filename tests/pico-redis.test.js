const _ = require('lodash');
const test = require('ava');
const storage = require('../pico-redis.js');

storage.connect();

test.before(()=>storage.clear());


test('Storing values', (t)=>{
	return storage.set('cool', 6)
		.then(()=>storage.get('cool'))
		.then((val)=>{
			t.is(val, 6);
		});
});


test('Storing values with expiry', (t)=>{
	return storage.set('with_expiry', true, 2)
		.then(()=>{
			return new Promise((resolve)=>setTimeout(resolve, 1000));
		})
		.then(()=>storage.get('with_expiry'))
		.then((val)=>{
			t.is(val, true);
		});
});


test('Storing complex values', (t)=>{
	const init_val = {
		cool : true,
		foo : [5, "okay this is a test", false],
		fancy : {
			doot : "test"
		}
	};
	return storage.set('complex', init_val)
		.then(()=>storage.get('complex'))
		.then((val)=>{
			t.is(_.isEqual(val, init_val), true);
		});
});


test('Accessing scoped values', (t)=>{
	const scoped = storage('test')
	storage.set('cool', 6)
		.then(()=>scoped.get('cool'))
		.then((val)=>{
			return t.is(val, undefined)
		})
});


test('Storing scoped values', (t)=>{
	const scoped = storage('test')
	scoped.set('cool', 6)
		.then(()=>scoped.get('cool'))
		.then((val)=>{
			return t.is(val, 6)
		})
});



test.after(()=>storage.close());