const Handlebars = require("handlebars");
const fs = require('fs');
const Parser = require('rss-parser');

async function renderTemplate(filename, context) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) { return reject(err); }
      const template = Handlebars.compile(data.toString());
      return resolve(template(context));
    });
  });
}

async function getLatestArticle(url) {
  const parser = new Parser();
  const feed = await parser.parseURL(url);
  return feed.items[0];
}
 
(async () => {
  const article = await getLatestArticle('https://matthewtole.com/feed.xml');
  const result = await renderTemplate('template.md', { article });
  console.log(result);
})();