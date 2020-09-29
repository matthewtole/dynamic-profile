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

async function updateReadme(contents) {
  return new Promise(resolve => {
    fs.writeFile('README.md', contents, (err) => {
      resolve();
    })
  });
}

async function loadConfig() {
  return new Promise((resolve, reject) => {
    fs.readFile('profile.json', (err, data) => {
      if (err) { return reject(err); }
      return JSON.parse(data.toString());
    });
  });
}

async function run() {
  try {const config = await loadConfig();
  const article = await getLatestArticle(config.feedUrl);
  const result = await renderTemplate('template.md', { article });
  await updateReadme(result);
  } catch (ex) {
    console.error(ex);
  }
}

module.exports = {run};