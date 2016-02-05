import express from 'express';
import http from 'http';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import { routes } from './routes';

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('*', (req, res) => {
  // routes is our object of React routes defined above
  match({ routes, location: req.url }, (err, redirectLocation, props) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      // matched a ReactRouter redirect
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (props) {
      // if we got props, it means we found a valid componet to render
      // for the given route
      const markup = renderToString(<RoutingContext {...props} />);

      res.render('index', { markup });
    } else {
      // no route match
      res.sendStatus(404);
    }
  });
});

const server = http.createServer(app);

server.listen(3003);
server.on('listening', () => {
  console.log('listening on 3003');
});