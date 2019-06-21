import redisClient from './redis';

export const fetchMessages = () => new Promise((resolve, reject) => {
  redisClient().then(
    (res) => {
      res.lrangeAsync('messages', 0, -1).then(
        (messages) => {
          resolve(messages);
        },
        (err) => {
          reject(err);
        }
      );
    },
    (err) => {
      reject(err);
    }
  );
});

export const addMessage = message => new Promise((resolve, reject) => {
  redisClient().then(
    (res) => {
      res
        .multi()
        .rpush('messages', message)
        .execAsync()
        .then(
          (response) => {
            resolve(response);
          },
          (err) => {
            reject(err);
          }
        );
    },
    (err) => {
      reject(err);
    }
  );
});

export const fetchActiveUsers = () => new Promise((resolve, reject) => {
  redisClient().then(
    (res) => {
      res.smembersAsync('users').then(
        (users) => {
          resolve(users);
        },
        (err) => {
          reject(err);
        }
      );
    },
    (err) => {
      reject(err);
    }
  );
});

export const addActiveUser = user => new Promise((resolve, reject) => {
  redisClient().then(
    (res) => {
      res
        .multi()
        .sadd('users', user)
        .execAsync()
        .then(
          (response) => {
            if (response[0] === 1) {
              resolve('User added');
            }

            reject(new Error('User already in list'));
          },
          (err) => {
            reject(err);
          }
        );
    },
    (err) => {
      reject(err);
    }
  );
});

export const removeActiveUser = user => new Promise((resolve, reject) => {
  redisClient().then(
    (res) => {
      res
        .multi()
        .srem('users', user)
        .execAsync()
        .then(
          (response) => {
            if (response === 1) {
              resolve('User removed');
            }
            reject(new Error('User is not in list'));
          },
          (err) => {
            reject(err);
          }
        );
    },
    (err) => {
      reject(err);
    }
  );
});
