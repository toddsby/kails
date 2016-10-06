import models from '../models/index';
import React from 'react';
import { renderToString } from 'react-dom/server';
import Articles from '../assets/javascripts/components/articles.jsx';
import { markdown } from '../helpers/markdown';
import fs from 'fs';
import { isNil } from 'mightty';
import { getCachedData, setCachedData } from '../services/cache.service';

const index = async (ctx, _next) => {
  let articleCount = null,
      articles = null,
      options = { expiry:60 };
  let page = parseInt(ctx.query.page, 10) || 1;
  page = page > 0 ? page : 1;
  let pageOffset = ( page - 1 ) * 10;

  articleCount = await getCachedData( Object.assign( {}, { cacheKey:'articleCount' }, options ), ctx );
  if ( isNil( articleCount ) ) {
    articleCount = await models.Article.count();
    setCachedData( Object.assign( {}, { cacheKey:'articleCount' }, options ), articleCount, ctx );
  }

  articles = await getCachedData( Object.assign( {}, { cacheKey:'articles' }, options ), ctx );
  if ( isNil( articles ) ) {
    articles = await models.Article.findAll({
      include: [{
        model: models.User,
        attributes: ['id', 'name']
      }],
      attributes: ['id', 'title', 'description', 'created_at'],
      order: 'created_at DESC',
      offset: pageOffset,
      limit: 10
    });
    setCachedData( Object.assign( {}, { cacheKey:'articles' }, options ), articles, ctx );
  }

  const prerenderHtml = await renderToString(
    <Articles articles={ articles } />
  );
  // ctx.session.userId = 4
  const locals = {
    title: 'Home',
    nav: 'index',
    prerenderHtml: prerenderHtml,
    preloadedState: { articles: articles },
    baseUrl: '/',
    currentPage: page,
    pages: parseInt(articleCount / 10 + 1)
  };
  await ctx.render('home/index', locals);
};

const about = async (ctx, _next) => {
  const readme = fs.readFileSync('README.md', 'utf8');
  const locals = {
    title: 'About',
    nav: 'about',
    content: readme,
    markdown: markdown
  };
  await ctx.render('home/about', locals);
};

export default {
  index,
  about
};
