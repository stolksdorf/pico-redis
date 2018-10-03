const Redis = require('redis');
let baseClient;

const MIN_VER = [2,6,12];

const compareSemVer = (verA, verB)=>{
	for(i in verA){
		if(verA[i] > verB[i]) return true;
		if(verA[i] < verB[i]) return false;
	}
	return true;
};

const buildScope = (scope='')=>{
	scope = (scope ? `${scope}|` : '');
	let client;
	const redis = {
		client : ()=>client || baseClient,
		connect : (redisUrl = process.env.REDIS_URL, opts)=>{
			client = Redis.createClient(redisUrl, opts);
			if(!baseClient) baseClient = client;

			return new Promise((resolve, reject)=>{
				redis.client().on('ready', ()=>{
					if(!compareSemVer(client.server_info.versions, MIN_VER)){
						return reject(`Err: Must have at least Redis v${MIN_VER.join('.')} installed`);
					}
					resolve(redis)
				});
				redis.client().on('error', (err)=>{
					redis.client().quit();
					return reject(err);
				});
			})
		},
		scope : (newScope)=>buildScope(newScope),
		close : ()=>{
			return new Promise((resolve, reject)=>{
				redis.client().quit((err)=>err ? reject(err) : resolve());
			})
		},
		clear : ()=>{
			return new Promise((resolve, reject)=>{
				redis.client().flushdb((err, success)=>{
					if(err || !success) return reject(err);
					return resolve(redis);
				});
			})
		},
		get : (key)=>{
			return new Promise((resolve, reject)=>{
				redis.client().get(`${scope}${key}`, (err, res)=>{
					if(err) return reject(err);
					try{ return resolve(JSON.parse(res)); }
					catch(e){ return resolve(res) };
				});
			});
		},
		set : (key, val, expiryInMS)=>{
			return new Promise((resolve, reject)=>{
				if(expiryInMS){
					redis.client().psetex(`${scope}${key}`, expiryInMS, JSON.stringify(val), (err)=>err?reject(err):resolve());
				}else{
					redis.client().set(`${scope}${key}`, JSON.stringify(val), (err)=>err?reject(err):resolve());
				}
			});
		},
		del : (key)=>{
			return new Promise((resolve, reject)=>{
				redis.client().del(`${scope}${key}`, (err)=>err?reject(err):resolve());
			});
		},
		keys : (param='*')=>{
			return new Promise((resolve, reject)=>{
				redis.client().keys(`${scope}${param}`, (err, keys)=>err?reject(err):resolve(keys));
			});
		},
	};
	return redis;
};

module.exports = buildScope();