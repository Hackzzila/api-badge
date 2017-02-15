const express = require('express');
const fs = require('fs');
const json = require('awesome-json');
const Color = require('color');
const superagent = require('superagent');
const responseTime = require('superagent-response-time');

try {
  fs.accessSync('stats.json');
} catch (err) {
  fs.writeFileSync('stats.json', '{"min":0,"max":0}');
}

const app = express();
const stats = json.readSync('stats.json', { writeFrequency: 5000 });
const red = Color({ h: 0, s: 65, l: 50 }).hex().substr(1);
const green = Color({ h: 120, s: 65, l: 50 }).hex().substr(1);

app.set('x-powered-by', false);

app.get('/v1/ping', (req, res) => {
  res.status(200).end();
});

app.get('/v1', (req, res) => {
  res.header('cache-control', 'no-cache');

  if (!req.query.url) return res.redirect(`https://img.shields.io/badge/api-no url param-${red}.svg`);

  superagent.get(req.query.url)
    .use(responseTime((r, time) => {
      if (r.res.statusCode >= 200 && r.res.statusCode < 300) {
        if (stats.max === 0 || time > stats.max) stats.max = time;
        if (stats.min === 0 || time < stats.min) stats.min = time;

        const hue = 120 - (120 * ((time - stats.min) / (stats.max - stats.min)));

        if (isFinite(hue)) {
          res.redirect(`https://img.shields.io/badge/api-${time.toFixed()}ms-${Color({ h: hue, s: 65, l: 50 }).hex().substr(1)}.svg`);
        } else res.redirect(`https://img.shields.io/badge/api-${time.toFixed()}ms-${green}.svg`);
      }
    }))
    .catch((r) => {
      if (res.timeout) res.redirect(`https://img.shields.io/badge/api-timeout-${red}.svg`);
      else if (r.status) res.redirect(`https://img.shields.io/badge/api-${r.status}-${red}.svg`);
      else res.redirect(`https://img.shields.io/badge/api-error-${red}.svg`);
    });

  return null;
});

app.listen(process.env.PORT || 80);

process.on('unhandledRejection', (err) => {
  throw err;
});
