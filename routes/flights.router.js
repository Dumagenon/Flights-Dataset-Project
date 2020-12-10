const router = require('express').Router();
const dataSet = require('../flights-db.json');
const speed = require('../processing/utils');
const SortProcess = require('../processing/sort');
const SearchProcess = require('../processing/search');

// Show own sort method result + speed
console.log('Speed of sorting: ',
  speed(() => console.log('Distance of every array item:',
      new SortProcess(1, 'asc').shakerSort(
        dataSet.slice(0, 30), 'distance'
      ).reduce((sum, el) => sum += el.distance + ' ', '')
    )
  )
);

router.get('/', async (req, res) => {
  try {
    const search = new SearchProcess(1), sort = new SortProcess(2, 'asc');
    const data = sort.quickSort(search.optionsSearch(dataSet, req.query), 'distance');
    // const data2 = Se.querySearch(dataSet, /^\s*$/i);

    res.status(200).json({
      items: [...data.slice(0, 10)],
      total: data.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
