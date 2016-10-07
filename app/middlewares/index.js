import helpers from '../helpers';
import models from '../models';
import { getCachedData, setCachedData } from '../services/cache.service';
import { isNil, mighttyConsole } from 'mightty';
import chalk from 'chalk';
import _ from 'lodash';

// catch error so we can display a user friendly page
// see view error/error.pug
async function catchError(ctx, next) {
  try {
    await next();
    if (ctx.status === 404) ctx.throw(404);
  } catch(err) {
    let status = err.status || 500;
    // let message = e.message || 'Server Error!'
    ctx.status = status;
    // helper for use in error.pug view
    ctx.state = {
      status: status,
      helpers: helpers,
      currentUser: null
    };
    await ctx.render('error/error', {});
    if (status == 500) {
      console.log( 'TELL ME THE STATUS', err );
    }
  }
}

// Creates ctx.state for use in views by pug templating engine

async function addHelper(ctx, next) {
  let currentUser = null,
      options = { 
        expiry:60,
        cacheKey:'currentUser'
      };
  if (ctx.session.userId) {
    currentUser = await getCachedData( options, ctx );
    console.warn( chalk.yellow( 'I\'m empty: ', isNil( currentUser ) ) );
    if ( isNil( currentUser ) ) {
      //mighttyConsole.log( chalk.blue('boooom baaby!'), {data:'yum'} );
      currentUser = await models.User.findById(ctx.session.userId,{
        attributes: { exclude: ['passwordDigest'] }
      });
      setCachedData( options, currentUser, ctx );
    }
  }

  // Avaliable in pug view templates
  // see layout/layout.pug
  ctx.state = {
    csrf: ctx.csrf,
    helpers: helpers,
    currentUser: currentUser,
    isUserSignIn: (currentUser != null)
  }
  await next();
}

export default {
  catchError,
  addHelper
};
