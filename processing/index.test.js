const sort = require('../processing/sort');
const search = require('../processing/search');

// Get flight from JSON file
function getData(num) {
  return require('../flights-db.json').slice(0, num);
}

describe('DB Processes - Search:', function () {
  const dataSet = getData(10);

  test('should search all cancelled items', () => {
    const opt = Object.entries({cancelled: 1});
    const res = dataSet.filter(flight => {
      return opt.every(([key, value]) => {
        return flight[key] == value;
      });
    });
    expect(search.optionsSearch(dataSet, {cancelled: 1})).toEqual(res);
  })

  test('should search all items by string', () => {
    const query = 'n428wn';
    const res = dataSet.filter(({ tailNum, origin, dest }) => {
      return search.isMatch(tailNum, query) || search.isMatch(origin, query) || search.isMatch(dest, query);
    });
    expect(search.querySearch(dataSet, query)).toEqual(res);
  })

  test('should search all items by RegExp', () => {
    const query = /(^[a-z])([0-9]{3})([a-z]{2})$/i;
    const res = dataSet.filter(({ tailNum, origin, dest }) => {
      return search.isMatch(tailNum, query) || search.isMatch(origin, query) || search.isMatch(dest, query);
    });
    expect(search.querySearch(dataSet, query)).toEqual(res);
  })
});

describe('DB Processes - Sorts:', function () {
  let res;

  function objectToStringByKey(data) {
    return data.reduce((sum, el) => sum += el.distance + ' ', '');
  }

  beforeEach(() => {
    res = objectToStringByKey(
      getData(10).sort(
        (a, b) => +a.distance > +b.distance ? 1 : -1
      )
    );
  })

  test('should Merge sort items', () => {
    expect(
      objectToStringByKey (
        sort.mergeSort (
          getData(10), 'distance'
        )
      )
    ).toEqual(res);
  })

  test('should Bubble sort items', () => {
    expect(
      objectToStringByKey (
        sort.bubbleSort (
          getData(10), 'distance'
        )
      )
    ).toEqual(res);
  })

  test('should Shaker sort items', () => {
    expect(
      objectToStringByKey (
        sort.shakerSort (
          getData(10), 'distance'
        )
      )
    ).toEqual(res);
  })

  test('should Quick sort items', () => {
    expect(
      objectToStringByKey (
        sort.quickSort (
          getData(10), 'distance'
        )
      )
    ).toEqual(res);
  })
});
