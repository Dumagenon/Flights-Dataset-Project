class ProcessFactory {
  constructor() {
    this.processes = {
      search: Search,
      sort: Sort
    }
  }

  create(type) {
    return new this.processes[type];
  }
}

class Search {

  /*
   * Apply search by query options.
   *
   * @param {Array} data - Array.
   * @param {Object} options - Object.
   * @returns Array of searched items
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

  /*
    Apply search by string or RegExp
    Params: data - Array of items, query - String or RegExp
    Returns: Array of searched items.
  */
  querySearch(data, query) {
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

  /*
    Check if there is an entry of query in the prop
    Params: prop - String, query - String
    Returns: true if it entry, false if not.
  */
  isMatch(prop, query) {
    if (typeof query === 'string') {
      return prop.toLowerCase().indexOf(query.toLowerCase()) !== -1 ? true : false;
    }
    return query.test(prop);
  }
}

class Sort {
  apply(data, key, type) {
    switch(type) {
      case 'bubble':
        return this.bubbleSort(data, key);
      case 'shaker':
        return this.shakerSort(data, key);
      case 'merge':
        return this.mergeSort(data, key);
      default:
        return this.quickSort(data, key);
    }
  }

  quickSort(data, key) {
    return this.quickSortRecursive(data, 0, data.length - 1, key)
  }

  quickSortRecursive(data, left, right, key) {
    if (data.length > 1) {
      let index = this._partition(data, left, right, key); //index returned from partition
      if (left < index - 1) { //more elements on the left side of the pivot
        this.quickSortRecursive(data, left, index - 1, key);
      }
      if (index < right) { //more elements on the right side of the pivot
        this.quickSortRecursive(data, index, right, key);
      }
    }
    return data;
  }

  _partition(data, left, right, key) {
    const pivot = data[Math.floor((right + left) / 2)]; //middle element

    while (left <= right) {

      while (this._isSwap(pivot, data[left], key)) left++;

      while (this._isSwap(data[right], pivot, key)) right--;

      if (left <= right) {
        this._swap(data, left, right); //swapping two elements
        left++;
        right--;
      }
    }
    return left;
  }

  /*
   * Merge Sort is a Divide and Conquer algorithm,
   *
   * @returns {array} Concatenated the leftover elements with sorted
   */
  mergeSort(array, key) {
    // No need to sort the array if the array only has one element or empty
    if (array.length <= 1) {
      return array;
    }

    // In order to divide the array in half, we need to figure out the middle
    const middle = Math.floor(array.length / 2);

    // This is where we will be dividing the array into left and right
    const left = array.slice(0, middle);
    const right = array.slice(middle);

    // Using recursion to combine the left and right
    return this._merge(
      this.mergeSort(left, key), this.mergeSort(right, key), key
    );
  }

  /*
   * Merge two arrays: left and right by key property
   *
   * @returns {array} Concatenated the leftover elements with sorted
   * @private
   */
  _merge(left, right, key) {
    let res = [];

    // Break out of loop if any one of the array gets empty
    while (left.length && right.length) {
      // Pick the smaller among the smallest element of left and right sub arrays
      if (this._isSwap(right[0], left[0], key)) {
        res.push(left.shift());
      } else {
        res.push(right.shift());
      }
    }
    // Concatenating the leftover elements
    // (in case we didn't go through the entire left or right array)
    return [ ...res, ...left, ...right ];
  }

  /*
   * Bubble sort not used for large arrays, Bubble will sort Array of 100k elem +- 30 minutes
   * @returns Link to this sorted data
   */
  bubbleSort(data, key) {
    let isSorted = false; // Using a flag to avoid unnecessary passage through the array
    let sortEnd = 0;

    while (!isSorted) {
      isSorted = true;

      /*
        Go forward the array and move a larger number
        Start from the beginning if isSorted = false
      */
      for (let j = 0; j < data.length - sortEnd - 1; j++) {
        isSorted = this._compareAndSwap(data, j, j + 1, key); // Comparing and swapping the elements
      }
      sortEnd++; // Say that from the end we have sorted + 1 element
    }
    return data;
  }

  /*
   * Cocktail Shaker Sort sorting array like Bubble sort, But walks back and forth
   * @returns Link to this sorted data
   */
  shakerSort(data, key) {
    let isSorted = false; // Using a flag to avoid unnecessary passage through the array
    let sortEnd = 0, sortStart = 0;

    while (!isSorted) {
      isSorted = true;

      // Go forward the array and move a larger number
      for (let j = sortStart; j < data.length - sortEnd - 1; j++) {
        isSorted = this._compareAndSwap(data, j, j + 1, key); // Comparing and swapping the elements
      }
      sortEnd++; // Say that from the end we have sorted + 1 element


      if (isSorted) break;
      isSorted = true;

      // Go back through the array and move a smaller number
      for (let j = data.length - sortEnd - 1; j > sortStart; j--) {
        isSorted = this._compareAndSwap(data, j - 1, j, key); // Comparing and swapping the elements
      }
      sortStart++; // Say that from the start we have sorted + 1 element
    }
    return data;
  }

  /*
   * Compare and Swap 2 elements by \_id and \_\_id in data - Array with key value
   *
   * @return {boolean} __false__ if swapped, __true__ if not.
   * @private
   */
  _compareAndSwap(data, _id, __id, key) {
    if (this._isSwap(data[_id], data[__id], key)) {
      this._swap(data, _id, __id);
      return false;
    }
    return true;
  }

  /*
   * Function to compare 2 property by key value. Works with Numbers and Strings
   *
   * @return {boolean} __true__, if _\_value > \_\_value_, else __false__.
   * @private
   */
  _isSwap(_value, __value, key) {
    /*
      Check that the incoming parameters are numbers.
      If the parameters are numbers, then compare them as numbers
    */
    return !isNaN(_value[key]) && !isNaN(__value[key]) ? +_value[key] > +__value[key] :
      // If the parameters are not numbers, then compare them as strings
      _value[key].localeCompare(__value[key]) === 1
  }

  /*
   * Swapping 2 elements by \_id and \_\_id in data - Array
   * @private
   */
  _swap(data, _id, __id) {
    const temp = data[__id];
    data[__id] = data[_id];
    data[_id] = temp;
  }
}

module.exports = new ProcessFactory();
