require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var rp = require('request-promise');
var cheerio = require('cheerio');
var fs = require('fs');

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()

var router = express.Router();

router.get('/github-ranking/:lang/:sorts', (req, res) => {
  let language = req.params.lang;
  let sort = req.params.sorts;
  let infos = {
    titles: [],
    descs: [],
    stars: [],
    updateDate: [],
    links: []
  };
  let url = `https://github.com/search?l=${language.replace('#', '%23')}&o=desc&q=${language.replace('#', '%23')}&s=${sort}&type=Repositories&utf8=%E2%9C%93`;
  let options = {
    url,
    transform(body) {
      return cheerio.load(body);
    }
  }
  let p = new Promise((resolve, reject) => {
    rp(options)
      .then($ => {
        let $titles = $('a.v-align-middle');
        let $descs = $('.col-9.d-inline-block.text-gray.mb-2.pr-4');
        let $stars = $('div.col-2 a');
        let $updateDate = $('p.f6.text-gray.mb-0.mt-2');

        $titles.each((index, item) => {
          infos.titles.push($(item).text().replace(/\s/g, ''));
          infos.links.push('https://github.com'+$(item).attr('href'));
        });
        $descs.each((index, item) => {
          infos.descs.push($(item).text().trim());
        });
        $stars.each((index, item) => {
          infos.stars.push($(item).text().replace(/[\s\n]/g, ''));
        });
        $updateDate.each((index, item) => {
          infos.updateDate.push($(item).text().trim());
        });
        resolve(infos);
      })
    });
    p.then((infos) => {
      res.json(infos)
    });
  });

app.use('/api', router);

var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
