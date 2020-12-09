const performance = require('perf_hooks').performance;


function speedTest(callback) {
  const timeUntil = performance.now();
  callback();
  const timeAfter = performance.now();
  return timeAfter - timeUntil;
}

module.exports = speedTest;
