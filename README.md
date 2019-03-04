# modern-ember-fastboot

This app features a modern ember:

+ No JQuery
+ No Ember Data (you can add it if you want it)
+ Native es6 classes and decorators
+ ember-fetch
+ SSR with fastboot
+ Sass css preprocessor via ember-cli-sass
+ Tailwind via ember-cli-tailwind (using ember-cli-postcss with the plugins autoprefixer and @fullhuman/postcss-purgecss) 

And a couple of extra handy addons or files
+ ember-cli-bundle-analyzer (check your bundle size)
+ ember-auto-import (import npm packages easily)
+ ember-get-config (get env variables easily everywhere)
+ /nodeServer.js and /Procfile for heroky deployment, you can delete these if you prefer to deploy elsewhere


You probably will need to run the blueprint for ember-cli-tailwind... `ember install ember-cli-tailwind` or `ember generate ember-cli-tailwind`  
