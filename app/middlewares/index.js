import logger from 'koa-logger';
import helpers from '../helpers';
import models from '../models';
import { isNil, mighttyConsole } from 'mightty';
import chalk from 'chalk';

async function catchError(ctx, next) {
  try {
    await next();
    if (ctx.status === 404) ctx.throw(404);
  } catch(err) {
    let status = err.status || 500;
    // let message = e.message || 'Server Error!'
    ctx.status = status;
    ctx.state = {
      status: status,
      helpers: helpers,
      currentUser: null
    };
    await ctx.render('error/error', {});
    if (status == 500) {
      logger.error('server error', err, ctx);
    }
  }
}

// Creates ctx.state for use in views by pug templating engine

async function addHelper(ctx, next) {
  let currentUser = null;
  if( isNil( ctx.state.currentUser ) ){
    console.warn( chalk.yellow( 'ARGH, I\'m empty capt\'n!!' ), {data:'some'},{datanew:'more'} );
    mighttyConsole.log( chalk.blue('boooom baaby!'), {data:'yum'} );
    currentUser = await models.User.findById(ctx.session.userId);

  // Avaliable in pug view templates
  // see layout/layout.pug
    ctx.state = {
      csrf: ctx.csrf,
      helpers: helpers,
      currentUser: currentUser,
      isUserSignIn: (currentUser != null)
    }
  }
  await next();
}

export default {
  catchError,
  addHelper
};
