const FastBootAppServer = require('fastboot-app-server');


let server = new FastBootAppServer({
  distPath: 'dist',
  // host: '0.0.0.0',
  gzip: true, // Optional - Enables gzip compression.
  beforeMiddleware(app) {
    app.use((request, response, next) => {
      if (request.headers['x-forwarded-proto'] === 'https') {
        return next();
      } else {
        return response.redirect(301, `https://${request.hostname}${request.url}`);
      }
    });
  }
});
server.start();
