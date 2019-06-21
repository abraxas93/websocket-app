import express from 'express';
import bodyParser from 'body-parser';
import socket from 'socket.io';
import path from 'path';
import env from 'dotenv';
import redisClient from './redis';
import * as routes from './routes';

env.config();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../public/views'));
app.set('view engine', 'pug');

// static files folder setup
app.use(express.static(path.join(__dirname, '../public/assets')));

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));
