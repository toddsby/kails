import Koa from 'koa';
import session from 'koa-generic-session';
import csrf from 'koa-csrf';
import views from 'koa-views';
import convert from 'koa-convert';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import methodOverride from 'koa-methodoverride';
import logger from 'koa-logger';
import { isNil } from 'mightty';
import chalk from 'chalk';

import config from '../config/config';
import router from './routes';
import koaRedis from 'koa-redis';
import models from './models';
import middlewares from './middlewares';
import cacheMiddle from './middlewares/cache';


// setup Redis, specifiy Redis server get from config.url
const redisStore = koaRedis({
  url: config.redisUrl
});

// Koa is made by the same people behind express, es6ified express
const app = new Koa();

// Koa for sigining cookies
app.keys = [config.secretKeyBase];

// not serve static when deploy
if(config.serveStatic){
  app.use(convert(require('koa-static')(__dirname + '/../public')));
}

// convert is a helper function provided by Koa from v1 to v2 
// switch from generators to await as default design
app.use(convert(session({
  store: redisStore,
  prefix: 'kails:sess:',
  key: 'kails.sid'
})));

// setup redis as a caching middleware
app.use(cacheMiddle({
  redis: { url: config.redisUrl }
}));

app.use(bodyParser());

// methodOverride is a lib that helps to pull the POST, PUT, UPDATE, DELETE verbs from unusal locations
// see hidden form elements with value/key of key "_method" and value of "_put"
// articles>edit.pug for example
app.use(methodOverride((req, _res) => {
  if (req.body && (typeof req.body === 'object') && ('_method' in req.body)) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use(convert(json()));
app.use(convert(logger()));

//views with pug
app.use(views(__dirname + '/views', { extension: 'pug' }));

// catch error
app.use(middlewares.catchError);

// csrf
app.use(convert(csrf()));

// add helpers for views, attaches helper functions like timeAgo 
// see app>helpers>index.js
app.use(middlewares.addHelper);

// use Koa-Router see github for api
app.use(router.routes(), router.allowedMethods());

console.log( chalk.blue('recieved arguments:'), !isNil(process.argv[2]) );

// convience mechanism for setting up interactive node cli with access to app while running
// usage node.js index.js -c
if (process.argv[2] && process.argv[2][0] == 'c') {
  const repl = require('repl');
  global.models = models;
  repl.start({
    prompt: '> ',
    useGlobal: true
  }).on('exit', () => { process.exit(); });
}
else {
  app.listen(config.port);
}

export default app;
