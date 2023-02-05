const methods = {
  getWidth(length) {
    const screen = window.screen.width;
    const max_records = Math.floor((screen >= 768? window.innerWidth : screen - 8) / 40) - 1;   
    return length < 7? 288 : 8 + 40 * (max_records >= length? length : max_records);
  },

  getToday() {
    const options = {year: 'numeric', month: 'short', day: 'numeric'};
    return new Date().toLocaleDateString('en-US', options);
  },

  getRecordIndex() {
    const today = this.getToday();
    const records = [...this.state.records];
    return records.findIndex(record => record.date === today);
  },

  getMaxGood(records) {
    const good = records.map(record => record.points.good);
    return Math.max(...good);
  },

  getMaxBad(records) {
    const bad = records.map(record => record.points.bad);

    return Math.max(...bad);
  },

  incrementPoints(type) {
    const index = this.getRecordIndex();

    const records = JSON.parse(JSON.stringify(this.state.records));

    switch(type) {
      case 1:
        if (index === -1) {
          records.push({
            index: records.length,
            date: this.getToday(),
            points: {
              good: 1,
              bad: 0
            }
          });
        }

        else 
          ++records[index].points.good;
        
        this.incrementor.push('good');
        
        break;

      case 2:
        if (index === -1) {
          records.push({
            index: records.length,
            date: this.getToday(),
            points: {
              good: 0,
              bad: 1
            }
          });
        }
        
        else 
          ++records[index].points.bad;
        
        this.incrementor.push('bad');

        break;

      case 3:
        if (index > 0) 
          --records[index].points.good;
        
        this.incrementor.pop();
        
        break;
  
      case 4:
        if (index > 0) 
          --records[index].points.bad;
          
        this.incrementor.pop();

        break;

      default:
        console.log('wrong type argument');
    }

    if (index > 0 && records[index].points.good === 0 && records[index].points.bad === 0)
      records.splice(index, 1);

    console.log(records);

    this.setState({
      records: records,
      points: {
        max_good: this.getMaxGood(records),
        max_bad: this.getMaxBad(records)
      }
    })
  },

  undo() {
    const incrementor = this.incrementor;
    const index = incrementor.length - 1;

    if (incrementor.length > 0) {
      if (incrementor[index] === 'good')
        this.incrementPoints(3);

      else if (incrementor[index] === 'bad')
        this.incrementPoints(4);
    }
  }
};

export default methods;