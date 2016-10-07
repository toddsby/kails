import { cachedFetch } from './cache';

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON( response ) {
  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus( response ) {
  if ( response.status >= 200 && response.status < 300 ) {
    return response;
  }
  const error = new Error( response.statusText );
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {object} [ctx]     Koa context
 *
 * @return {object}           An object containing either "data" or "err"
 */
export async function request ( url, options, ctx ) { // eslint-disable-line
  const expiry = { expiry:60 };
  return cachedFetch( url, Object.assign( {}, expiry, options ), ctx ) // eslint-disable-line 
    .then( checkStatus )
    .then( parseJSON )
    .then( ( data ) => ( { data } ) )
    .catch( ( err ) => ( { err } ) );
}