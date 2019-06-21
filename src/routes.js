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
