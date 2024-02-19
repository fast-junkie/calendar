calendar
---

This is my version of a simple, home rolled JavaScript calendar... please note, I borrowed ideas from [`code-boxx`](https://gist.github.com/code-boxx/ee4333471196b25886ee0ad6da4e13a4) though the API has been rewritten in its entirety... it is still based around the `code-boxx` zen...  

Unlike `code-boxx` I did not write any custom styles, I used several vendor libraries instead. I did used `Bootstrap`, but I chose the [`Tailwind`](https://tailwindcss.com/docs/utility-first) philosophy, utility over component, with one exception. I lazily used `Bootstrap`'s modal component 😖.

Client side
* [Bootstrap](https://getbootstrap.com/)
* [Bootstrap Icons](https://icons.getbootstrap.com/)
* [Luxon](https://moment.github.io/luxon/#/)

NPM packages
* [debug](https://www.npmjs.com/package/debug)
* [express](https://www.npmjs.com/package/express)
* [morgan](https://www.npmjs.com/package/morgan)
* [copy-files-from-to](https://www.npmjs.com/package/copy-files-from-to)
* [eslint](https://www.npmjs.com/package/eslint)
* [eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base)
* [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)
* [grunt](https://www.npmjs.com/package/grunt)
* [grunt-banner](https://www.npmjs.com/package/grunt-banner)
* [grunt-contrib-sass](https://www.npmjs.com/package/grunt-contrib-sass)
* [grunt-contrib-uglify](https://www.npmjs.com/package/grunt-contrib-uglify)
* [grunt-contrib-watch](https://www.npmjs.com/package/grunt-contrib-watch)
* [nodemon](https://www.npmjs.com/package/nodemon)
* [sass](https://www.npmjs.com/package/sass)

To kick the proverbial tires
---

```
npm run build && npm start
```
Then load up `localhost:2112` yep, huge [Rush](https://www.rush.com/albums/2112/) fan...

Holiday's
---
I do a simple `localStorage` insert of common US holiday's 2024, 2025, purely out of boredom. You can just comment out the `(new Holidays()).init();` to stop the initialization of them.

The humans
---
```shell
/* TEAM */
  Human      : Fast Junkie
  Contact    : fj-development [at] use.startmail.com
  Mastodon   : @fast_junkie@mas.to
  Location   : These ------ States of America
  Oeuvre     : fj-development

/* SITE */
  Version    : 2024.02.58
  Language   : English [American]
  IDE        : VSCodium 1.85.2, GIMP 2.10.36
  Modified   : 2024-02-18T13:17:59-05:00
```
