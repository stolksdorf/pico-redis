# 🕳️ pico-redis
An incredibly tiny async/promise redis wrapper

[![NPM](https://nodei.co/npm/pico-redis.png)](https://nodei.co/npm/pico-redis/)

A simple promise and scoped based wrapper for [`node-redis`](https://www.npmjs.com/package/redis)


## install

```
npm i pico-redis
```

## features
- Promises on `get`, `set`, `del`, and `keys`
- `set` supports expiry as an additional parameter
- Automatically stores and parses JSON
- Able to create scoped accessors by adding prefixes to keys


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


### `redis.connect([redis_url], [redis_opts])`
Creates and connects to the redis instance. By default, uses the `process.env.REDIS_URL` if `redis_url` is not specified. This will also create a new redis client isolated to this scope, see `redis.scope`

### `redis.close()`
Closes the connection. Returns a promise.

### `redis.clear()`
Clears the entire redis instance of all entries. Returns a promise.


### `redis.keys([search])`
Returns an array of all the keys. If `search` is provided will use that as a regex on the keys.

### `redis.scope([scope])`
Returns an instance of the lib where all the accessors use a `key` that is prefixed with `scope`. Can have it's own redis client if `.connect()` is called on the returned scope.

### `redis.client()`
Access to the redis client created by [`node-redis`](https://www.npmjs.com/package/redis)


