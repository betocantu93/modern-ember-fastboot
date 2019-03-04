# modern-ember-fastboot

This app features a modern ember:

- No JQuery
- No Ember Data (you can add it if you want it)
- Native es6 classes and decorators via ember-decorators
- ember-fetch
- SSR with fastboot
- Sass css preprocessor via ember-cli-sass
- Tailwind via ember-cli-tailwind (using ember-cli-postcss with the plugins autoprefixer and @fullhuman/postcss-purgecss)
- Web Manifest via ember-web-app

And a couple of extra handy addons, files and configuration

- ember-cli-bundle-analyzer (check your bundle size)
- ember-auto-import (import npm packages easily)
- ember-get-config (get env variables easily everywhere)
- /nodeServer.js and /Procfile for heroky deployment, you can delete these if you prefer to deploy elsewhere
- ember features enabled/disabled
```
    {
        "application-template-wrapper": false,
        "jquery-integration": false,
        "template-only-glimmer-components": true
    }
  ```


You probably will need to run the blueprint for ember-cli-tailwind... `ember install ember-cli-tailwind` or `ember generate ember-cli-tailwind`
