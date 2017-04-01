# pico-redis
An incredibly tiny redis wrapper

[![NPM](https://nodei.co/npm/pico-redis.png)](https://nodei.co/npm/pico-redis/)

Promise and scoped based wrapper for [node](https://www.npmjs.com/package/redis)


## install

```
npm install --save pico-redis
```

## features
- Promises on `get`, `set`, `del`, and `keys`
- `set` supports expiry as an additional parameter
- Automatically stores and parses JSON
- Able to create scoped accessors


## documentation

### usage

```javascript
const redis = require('pico-redis');
redis.connect();

redis.set('test', {fancy : 6})
	.then(()=>redis.get('test'))
	.then((val)=>{
		console.log(val);
	})

```

### `redis.set(key, val, [expiry])`
Stores `key-val` pair in redis. Optional `expiry` in seconds. Converts the `val` into stringified JSON. Returns a promise.

### `redis.get(key)`
Retrieves the `val` stored at `key`. `val` will be attempted to be JSON parsed. Returns a promise.

### `redis.del(key)`
Removes the `val` stored at `key`. Returns a promise.


### `redis.connect([redis_url])`
Creates and connects to the redis instance

### `redis.close()`
Closes the connection

### `redis.clear()`
Clears the entire redis instance of all entries. Returns a promise.


### `redis.keys([search])`
Returns an array of all the keys. If `search` is provided will use that as a regex on the keys.

### `redis(scope)`
Returns an instance of the lib where all the accessors use a `key` that is prefixed with `scope`.

### `redis.raw`
Access to the raw instance of `node-redis`


