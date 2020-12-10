const Process = require('./index');

class SortProcess extends Process {
  constructor(id, order) {
    super(id);
    this.order = order;
  }

  /**
   * @param {String} ord
   */
  set order(ord) {
    const lowOrd = ord.toLowerCase();
    this._order = lowOrd !== 'desc' && lowOrd !== 'asc' ? 'asc' : lowOrd;
  }

  /**
   * @return {String}
   */
  get order() {
    return this._order;
  }
  
  // This is OOP baby!!!
  create() {
    console.log('I am create uniq Sort process, id:', this.processId);
  }

  /**
   * Function to compare 2 property by key value. Works with Numbers and Strings
   *
   * @return {boolean} __true__, if _\_value > \_\_value_, else __false__.
   */
  isSwap(_value, __value, key) {
    /*
      Check that the incoming parameters are numbers.
      If the parameters are numbers, then compare them as numbers
    */
    if (!isNaN(_value[key]) && !isNaN(__value[key])) {
      return this.order === 'asc' ? +_value[key] > +__value[key] : +_value[key] < +__value[key];
    }
    // If the parameters are not numbers, then compare them as strings
    return _value[key].localeCompare(__value[key]) === (this.order === 'asc' ? 1 : -1);
  }

  /**
   * Swapping 2 elements by \_id and \_\_id in data - Array
   *
   * @return {void}
   */
  swap(data, _id, __id) {
    const temp = data[__id];
    data[__id] = data[_id];
    data[_id] = temp;
  }
}

/**
 * Sort utility
 *
 * @param  {Number} id
 * @param {String} order
 */
class Sort extends SortProcess{

  constructor(id, order) {
    super(id, order);
  }

  /** Quick Sort is a Divide and Conquer algorithm.
   *
   * @returns {array} Concatenated the leftover elements with sorted
   */
  quickSort(data, key = 'origin') {
    return this._quickSortRecursive(data, 0, data.length - 1, key)
  }

  /** Recursive quick sort function to split array into 2 parts
   *
   * @returns {Array}
   * @private
   */
  _quickSortRecursive(data, left, right, key) {
    if (data.length > 1) {
      let index = this._partition(data, left, right, key);

      if (left < index - 1) { //more elements on the left side of the pivot
        this._quickSortRecursive(data, left, index - 1, key);
      }
      if (index < right) { //more elements on the right side of the pivot
        this._quickSortRecursive(data, index, right, key);
      }
    }
    return data;
  }

  /** Compare elements with pivot rom two sides
   *
   * @returns {Number} Index
   * @private
   */
  _partition(data, left, right, key) {
    const pivot = data[Math.floor((right + left) / 2)]; //middle element

    while (left <= right) {

      // Finding element less then pivot from left side
      while (this.isSwap(pivot, data[left], key)) left++;

      // Finding element bigger then pivot from right side
      while (this.isSwap(data[right], pivot, key)) right--;

      if (left <= right) {
        this.swap(data, left, right); //swapping two elements
        left++;
        right--;
      }
    }
    return left;
  }

  /**
   * Merge Sort is a Divide and Conquer algorithm.
   *
   * @return {Array}
   */
  mergeSort(array, key = 'origin') {
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

  /**
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
      if (this.isSwap(right[0], left[0], key)) {
        res.push(left.shift());
      } else {
        res.push(right.shift());
      }
    }
    // Concatenating the leftover elements
    // (in case we didn't go through the entire left or right array)
    return [ ...res, ...left, ...right ];
  }

  /**
   * Bubble sort not used for large arrays, Bubble will sort Array of 100k elem +- 30 minutes
   * @returns Link to this sorted data
   */
  bubbleSort(data, key = 'origin') {
    let isSorted = false; // Using a flag to avoid unnecessary passage through the array
    let sortEnd = 0;

    while(!isSorted) {
      isSorted = true;

      /*
        Go forward the array and move a larger number
        Start from the beginning if isSorted = false
      */
      for (let j = 0; j < data.length - sortEnd - 1; j++) {
        // Comparing and swapping the elements, if items swapped isSorted = false
        isSorted = this._compareAndSwap(data, j, j + 1, key) ? false : isSorted;
      }
      sortEnd++; // Say that from the end we have sorted + 1 element
    }
    return data;
  }

  /**
   * Cocktail Shaker Sort sorting array like Bubble sort, But walks back and forth
   * @return {Array} Link to this sorted data
   */
  shakerSort(data, key = 'origin') {
    let isSorted = false; // Using a flag to avoid unnecessary passage through the array
    let sortEnd = 0, sortStart = 0;

    while (!isSorted) {
      isSorted = true;

      // Go forward the array and move a larger number
      for (let j = sortStart; j < data.length - sortEnd - 1; j++) {
        isSorted = this._compareAndSwap(data, j, j + 1, key) ? false : isSorted; // Comparing and swapping the elements
      }
      sortEnd++; // Say that from the end we have sorted + 1 element


      if (isSorted) break;
      isSorted = true;

      // Go back through the array and move a smaller number
      for (let j = data.length - sortEnd - 1; j > sortStart; j--) {
        isSorted = this._compareAndSwap(data, j - 1, j, key) ? false : isSorted; // Comparing and swapping the elements
      }
      sortStart++; // Say that from the start we have sorted + 1 element
    }
    return data;
  }

  /**
   * Compare and Swap 2 elements by \_id and \_\_id in data - Array with key value
   *
   * @return {boolean} __true__ if swapped, __false__ if not.
   * @private
   */
  _compareAndSwap(data, _id, __id, key) {
    if (this.isSwap(data[_id], data[__id], key)) {
      this.swap(data, _id, __id);
      return true;
    }
    return false;
  }
}

module.exports = Sort;