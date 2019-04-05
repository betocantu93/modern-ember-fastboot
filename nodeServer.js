const EmberAppServer = require('./fastboot-server/ember-app-server');
var detector = require('./fastboot-server/utils/is-spider')

let server = new EmberAppServer({
  distPath: 'dist',
  host: '0.0.0.0',
  gzip: true, // Optional - Enables gzip compression.
  chunkedResponse: true,
  beforeMiddleware(app) {
    app.use((request, response, next) => {
      if (request.headers['x-forwarded-proto'] === 'https') {
        return next();
      } else {
        // return next();
        return response.redirect(301, `https://${request.hostname}${request.url}`);
      }
    });
    app.use(detector.middleware());
  }
});

server.start();
