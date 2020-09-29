#!/usr/bin/env node

const {run} = require('../');

(async () => {
  try { await run(); } catch (ex) { console.error(ex);}
})();