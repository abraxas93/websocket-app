
import redis from 'redis';
import promise from 'bluebird';

promise.promisifyAll(redis.RedisClient.prototype);
promise.promisifyAll(redis.Multi.prototype);

export default () => new Promise((resolve, reject) => {
  const connector = redis.createClient(process.env.REDIS_HOST);

  connector.on('error', () => {
    reject(new Error('Redis Connection failed'));
  });

  connector.on('connect', () => {
    console.log('connected');
    resolve(connector);
  });
});
