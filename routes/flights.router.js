const router = require('express').Router();
const dataSet = require('../flights-db.json');
const DBProcess = require('../processing');
const speed = require('../processing/utils');
const sort = DBProcess.create('sort');

// console.log(require('../flights-db.json').sort((a, b) => +a.distance > +b.distance ? 1 : -1).slice(0, 10).reduce((sum, el) => sum += el.distance + ' ', ''));
console.log(speed(() => console.log(sort.quickSort(require('../flights-db.json').slice(0, 100000), 'distance').slice(0, 30).reduce((sum, el) => sum += el.distance + ' ', ''))));
// console.log(require('../flights-db.json').slice(0, 10).reduce((sum, el) => sum += el.distance + ' ', ''));

router.get('/', async (req, res) => {
  try {
    const search = DBProcess.create('search');
    const data = search.optionsSearch(dataSet, { dayOfMonth: '8', cancelled: '1', origin: 'LAS' });
    const data2 = search.querySearch(dataSet, /^\s*$/i);

    res.status(200).json({
      items: [...data.slice(0, 5), ...data2.slice(0, 7)],
      total: data.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
