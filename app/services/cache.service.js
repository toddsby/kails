import fetch from 'node-fetch';
import { isNill } from 'mightty';

export async function getCachedData ( { cacheKey }, ctx ) {
  // check if options contains cachedKey
  // check redis for cachedKey
  // return null or { object } [data]
  let data = null;
  if ( cacheKey ) {

    return data = await ctx.cache.get( cacheKey );

  } else {

    return data;

  }

}

export async function setCachedData ( { cacheKey, expiry }, data, ctx ) {

  await ctx.cache.set( cacheKey, data, expiry );

}

export async function cachedFetch ( url, options, ctx ) {

  let data = await getCachedData( options, ctx );

  if ( !isNil( data ) ) {
    return data;
  }

  data = await fetch( url, options );
  if ( !isNil( data ) ) {

    await setCachedData( options, response.data, ctx );
    return data;

  } else {

    throw Error( 'Fetch failed, no data!' );

  }

}