/* eslint-disable no-unused-vars */
import express from 'express';
import redisClient from './redis';
import * as helpers from './functions';

const router = express.Router();

const fetchMessages = () => helpers.fetchMessages().then(
  res => res,
  (err) => {
    console.log(err);
  }
);

// eslint-disable-next-line prefer-const
let fetchUsers = () => helpers.fetchActiveUsers().then(
  res => res,
  (err) => {
    console.log(err);
  }
);

export const home = router.get('/', (req, res) => {
  res.render('index', { title: 'Chat Room' });
});

export const chatRoom = router.get('/chat/:username', (req, res) => {
  res.render('room', { user: req.params.username });
});

export const messages = router.get('/messages', (req, res) => {
  fetchMessages().then((msgs) => {
    res.send(msgs);
  });
});

export const users = router.get('/users', (req, res) => {
  fetchUsers().then((u) => {
    res.send(u);
  });
});

export const createUser = router.post('/user', (req, res) => {
  let users;
  const { user } = req.body;

  fetchUsers().then((u) => {
    users = u;
    if (users.indexOf(user) === -1) {
      helpers.addActiveUser(user).then(
        () => {
          redisClient().then(
            (client) => {
              const msg = {
                message:
                                    `${req.body.user
                                    } just joined the chat room`,
                user: 'system'
              };

              client.publish('chatMessages', JSON.stringify(msg));
              client.publish(
                'activeUsers',
                JSON.stringify(fetchUsers())
              );

              helpers.addMessage(JSON.stringify(msg)).then(
                () => {
                  res.send({
                    status: 200,
                    message: 'User joined'
                  });
                },
                (err) => {
                  console.log(err);
                }
              );
            },
            (err) => {
              console.log(err);
            }
          );
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      res.send({ status: 403, message: 'User already exist' });
    }
  });
});

export const deleteUser = router.delete('/user', (req, res) => {
  let users;
  const { user } = req.body;

  fetchUsers().then((u) => {
    users = u;

    if (users.indexOf(user) !== -1) {
      helpers.removeActiveUser(user).then(
        () => {
          redisClient().then(
            (client) => {
              const msg = {
                message: `${req.body.user} just left the chat room`,
                user: 'system'
              };

              client.publish('chatMessages', JSON.stringify(msg));
              client.publish(
                'activeUsers',
                JSON.stringify(fetchUsers())
              );

              helpers.addMessage(JSON.stringify(msg)).then(
                () => {
                  res.send({
                    status: 200,
                    message: 'User removed'
                  });
                },
                (err) => {
                  console.log(err);
                }
              );
            },
            (err) => {
              console.log(err);
            }
          );
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      res.send({ status: 403, message: 'User does not exist' });
    }
  });
});

export const createMessage = router.post('/message', (req, res) => {
  const msg = {
    message: req.body.msg,
    user: req.body.user
  };

  redisClient().then(
    (client) => {
      client.publish('chatMessages', JSON.stringify(msg));

      helpers.addMessage(JSON.stringify(msg)).then(
        () => {
          res.send({
            status: 200,
            message: 'Message sent'
          });
        },
        (err) => {
          console.log(err);
        }
      );
    },
    (err) => {
      console.log(err);
    }
  );
});
