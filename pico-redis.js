let redis;

const Picoredis = (scope)=>{
	scope = (scope ? scope + '|' : '');

	return {
		raw : redis,
		connect : (redisUrl = process.env.REDIS_URL, opts)=>{
			redis = require('redis').createClient(redisUrl, opts);
			Picoredis.raw = redis;
			return Promise.resolve();
		},
		close : ()=>{
			return redis.quit();
		},
		clear : ()=>{
			return new Promise((resolve, reject)=>{
				redis.flushdb((err, success)=>{
					if(err || !success) return reject(err);
					return resolve();
				});
			})
		},


		get : (key)=>{
			return new Promise((resolve, reject)=>{
				redis.get(`${scope}${key}`, (err, res)=>{
					if(err) return reject(err);
					try{ return resolve(JSON.parse(res)); }
					catch(e){ return resolve(res) };
				});
			});
		},
		set : (key, val, expiry)=>{
			return new Promise((resolve, reject)=>{
				if(expiry){
					redis.set(`${scope}${key}`, JSON.stringify(val), 'EX', expiry, (err)=>{
						if(err) return reject(err);
						return resolve();
					});
				}else{
					redis.set(`${scope}${key}`, JSON.stringify(val), (err)=>{
						if(err) return reject(err);
						return resolve();
					});
				}
			});
		},
		del : (key)=>{
			return new Promise((resolve, reject)=>{
				redis.del(`${scope}${key}`, (err)=>{
					if(err) return reject(err);
					return resolve();
				});
			});
		},
		keys : (param='*')=>{
			return new Promise((resolve, reject)=>{
				redis.keys(`${scope}${param}`, (err, keys)=>{
					if(err) return reject(err);
					return resolve(keys);
				});
			});
		}
	}
}

module.exports = Object.assign(Picoredis, Picoredis());