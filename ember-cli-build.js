'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        enabled: false
      },
      filter: {
        enabled: true,
        plugins: [
          {
            module: purgecss,
            options: {
              content: ['./app/**/*.hbs', './app/**/.js'],
            }
          },
          {
            module: require('autoprefixer')
          }
        ]
      }
    }
    // Add options here
  });


  return app.toTree();
};
