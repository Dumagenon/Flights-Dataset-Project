const fs = require('fs');
const path = require('path');

class Dataset {
  constructor() {
    this.data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'flights-db.json')));
  }

  getCanceledFlight() {
    return this.data.filter(flight => +flight.Cancelled);
  }
}

module.exports = new Dataset();
