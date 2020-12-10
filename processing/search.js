const Process = require('./index');

class Search extends Process {

  constructor(id) {
    super(id);
  }

  // This is OOP baby!!!
  create() {
    console.log('I am create uniq Search process, id:', this.processId);
  }

  /**
   * Apply search by query options.
   *
   * @param {Array} data - Array.
   * @param {Object} options - Object.
   * @return {Array} Searched items
   */
  optionsSearch(data, options = {}) {
    const result = [];
    const opt = Object.entries(options); // Transform object in array of entries

    // If there are no options, return an unmodified array
    if (opt.length === 0) return data;

    // Linear search iterates over the array and finds all matches.
    for (let i = 0; i < data.length; i++) {
      let flag = true;

      /*
        I can used Array.every() here,
        But I had to write everything myself,
        and that's what happened!)
      */
      for (const [key, value] of opt) {
        if (data[i][key] != value) {
          flag = false;
          break;
        }
      }

      // If every option was correct, we add item in final result
      if (flag) {
        result.push(data[i]);
      }
    }

    /*
      Haw can I do it, by only JS Array methods:
        return data.filter(flight => {
          return opt.every(([key, value]) => {
            return flight[key] == value;
          })
        });
    */
    return result;
  }

  /**
   * Apply search by string or RegExp
   *
   * @param {Array} data
   * @param {String, RegExp} query - String or RegExp.
   * @return {Array} Searched items
  */
  querySearch(data, query) {
    if (!query) return data;

    const result = [];

    // Linear search iterates over the array and finds all matches.
    for (let i = 0; i < data.length; i++) {
      const { tailNum, origin, dest } = data[i];

      // If every option was correct, we add item in final result
      if (this.isMatch(tailNum, query) || this.isMatch(origin, query) || this.isMatch(dest, query)) {
        result.push(data[i]);
      }
    }

    /*
      Haw can I do it, by only JS Array methods:
        return data.filter(({ tailNum, origin, dest }) => {
          return this.isMatch(tailNum, query) || this.isMatch(origin, query) || this.isMatch(dest, query);
        });
    */
    return result;
  }

  /**
   * Check if there is an entry of query in the prop
   *
   * @param {String} prop
   * @param {String, RegExp} query - String or RegExp.
   * @returns __true__ if it entry, __false__ if not.
   */
  isMatch(prop, query) {
    if (typeof query === 'string') {
      return prop.toLowerCase().indexOf(query.toLowerCase()) !== -1 ? true : false;
    }
    return query.test(prop);
  }
}

module.exports = Search;
