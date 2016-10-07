import wrapper from 'co-redis';
import Redis from 'redis';

module.exports = function (options) {
  options = options || {};
  const prefix = options.prefix || 'kails-cache:';
  const expiry = options.expiry || 1800; //redis setex (key, expiry, value), expiry is in seconds -- ie 30 min

  let redisAvailable = false;
  let redisOptions = options.redis || {};

  const redisClient = wrapper(
    Redis.createClient(redisOptions.url, redisOptions.options)
  );

  redisClient.on('error', (_error)=> {
    redisAvailable = false;
  });

  redisClient.on('end', () => {
    redisAvailable = false;
  });

  redisClient.on('connect', () => {
    redisAvailable = true;
  });

  const setCache = async function(key, value, options) {
    if(!redisAvailable){
      return;
    }
    if (value == null) {
      return;
    }
    options = options || {};
    key = prefix + key;
    const expire = options.expiry || expiry;
    console.log('MYYY EXPIRY IS:', options.expiry);
    value = JSON.stringify(value);
    let rr = await redisClient.setex(key, expire, value);
    console.log(rr, expire);
  };

  const getCache = async function(key) {
    if(!redisAvailable){
      return;
    }
    key = prefix + key;
    let data = await redisClient.get(key);
    if(data) {
      data = JSON.parse(data.toString());
    }
    return data;
  };

  const delCache = async function( key ) {
    if(!redisAvailable){
      return;
    }
    key = prefix + key;
    await redisClient.del(key);
    console.log('BEEELeted redis Key', key);
  }

  // sets up redis cache on koa context 
  // @param {object}[ctx]
  // 
  // add to cache with ctx.cache.set
  // retrieve from cache with ctx.cache.get
  const cacheMiddle = async function(ctx, next) {
    ctx.cache = {
      get: getCache,
      set: setCache,
      del: delCache
    };
    await next();
  };

  return cacheMiddle;
};
