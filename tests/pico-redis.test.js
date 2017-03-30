//const test = require('ava');

const storage = require('../pico-redis.js');

storage.connect();


const scoped = storage('test')


storage.set('cool', 6)
	.then(()=>storage.get('cool'))
	.then((res)=>console.log(res))
	.then(()=>scoped.get('cool'))
	.then((res)=>console.log(res))
	.then(()=>scoped.set('cool', true))
	.then(()=>storage.keys())
	.then((res)=>console.log(res))
	.then(()=>scoped.keys())
	.then((res)=>console.log(res))
	.then(()=>storage.close())

//add in a set expiry test
