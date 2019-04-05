"use strict";

const FastBoot           = require('fastboot');
const fastbootMiddleware = require('fastboot-express-middleware');
const ExpressHTTPServer  = require('fastboot-app-server/src/express-http-server');
const express = require('express');
var conditional = require('express-conditional-middleware');

class CustomExpressServer extends ExpressHTTPServer {
  constructor() {
    super(...arguments)
  }

  serve(fastbootMiddleware) {
    let app = this.app;
    let username = this.username;
    let password = this.password;

    this.beforeMiddleware(app);

    if (this.gzip) {
      this.app.use(require('compression')());
    }

    if (username !== undefined || password !== undefined) {
      this.ui.writeLine(`adding basic auth; username=${username}; password=${password}`);
      app.use(basicAuth(username, password));
    }

    if (this.cache) {
      app.get('/*', this.buildCacheMiddleware());
    }

    if (this.distPath) {
      app.get('/', conditional(
        (req) => {
          return req.isSpider();
        },
        fastbootMiddleware,
        (_req, _rest, next) => {
          next();
        }
      ));
      app.use(express.static(this.distPath));
      app.get('/assets/*', function(req, res) {
        res.sendStatus(404);
      });
    }

    app.get('/*', conditional(
      (req) => {
        return req.isSpider();
      },
      fastbootMiddleware,
      (_req, _rest, next) => {
        next();
      }
    ));


    this.afterMiddleware(app);

    return new Promise(resolve => {
      let listener = app.listen(this.port || process.env.PORT || 3000, this.host || process.env.HOST, () => {
        let host = listener.address().address;
        let port = listener.address().port;

        this.ui.writeLine('HTTP server started; url=http://%s:%s', host, port);

        resolve();
      });
    });
  }
  verifyRobotsMiddleWare(fastbootMiddleware) {
    if(true) {
      return fastbootMiddleware;
    } else {
      return (req, res, next) => {
        next();
      }
    }
    
  }
}

class Worker {
  constructor(options) {
    this.distPath = options.distPath;
    this.httpServer = options.httpServer;
    this.ui = options.ui;
    this.cache = options.cache;
    this.gzip = options.gzip;
    this.host = options.host;
    this.port = options.port;
    this.username = options.username;
    this.password = options.password;
    this.beforeMiddleware = options.beforeMiddleware;
    this.afterMiddleware = options.afterMiddleware;
    this.sandboxGlobals = options.sandboxGlobals;
    this.chunkedResponse = options.chunkedResponse;

    if (!this.httpServer) {
      this.httpServer = new CustomExpressServer({
        ui: this.ui,
        distPath: this.distPath,
        cache: this.cache,
        gzip: this.gzip,
        host: this.host,
        port: this.port,
        username: this.username,
        password: this.password,
        beforeMiddleware: this.beforeMiddleware,
        afterMiddleware: this.afterMiddleware,
        sandboxGlobals: options.sandboxGlobals,
      });
    }

    if (!this.httpServer.cache) { this.httpServer.cache = this.cache; }
    if (!this.httpServer.distPath) { this.httpServer.distPath = this.distPath; }
    if (!this.httpServer.ui) { this.httpServer.ui = this.ui; }
  }

  start() {
    if (!this.distPath) {
      this.middleware = this.noAppMiddleware();
    } else {
      this.middleware = this.buildMiddleware();
    }

    this.bindEvents();
    this.serveHTTP();
  }

  bindEvents() {
    process.on('message', message => this.handleMessage(message));
  }

  handleMessage(message) {
    switch (message.event) {
      case 'reload':
        this.fastboot.reload();
        break;
      case 'error':
        this.error = message.error;
        break;
      case 'shutdown':
        process.exit(0);
        break;
    }
  }

  buildMiddleware() {
    this.fastboot = new FastBoot({
      distPath: this.distPath,
      sandboxGlobals: this.sandboxGlobals,
    });

    return fastbootMiddleware({
      fastboot: this.fastboot,
      chunkedResponse: this.chunkedResponse,
    });
  }
  emptyMiddleware() {
    return (req, res, next) => {
      next();
    };
  }
  serveHTTP() {
    this.ui.writeLine('starting HTTP server');
    return this.httpServer.serve(this.middleware)
      .then(() => {
        process.send({ event: 'http-online' });
      });
  }

  noAppMiddleware() {
    return (req, res) => {
      let html = '<h1>No Application Found</h1>';

      if (this.error) {
        html += '<pre style="color: red">' + this.error + '</pre>';
      }

      res.status(500).send(html);
    };
  }
}

module.exports = Worker;