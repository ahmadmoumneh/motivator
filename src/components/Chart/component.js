import { Component } from 'react';
import './style.css';
import data from '../../assets/json/data.json'
import Incrementor from '../Incrementor/component';
import methods from './methods';

class Chart extends Component {
  constructor(props) {
    super(props);

    this.state = data;
    this.incrementor = [];

    window.addEventListener('resize', this.resizeCanvas);

    this.getToday = methods.getToday.bind(this);
    this.getWidth = methods.getWidth.bind(this);
    this.getRecordIndex = methods.getRecordIndex.bind(this);
    this.getMaxGood = methods.getMaxGood.bind(this);
    this.getMaxBad = methods.getMaxBad.bind(this);
    this.incrementPoints = methods.incrementPoints.bind(this);
    this.undo = methods.undo.bind(this);
  }

  componentDidMount() {
    this.drawDiagram();
  }
  
  componentDidUpdate() {
    this.drawDiagram();
  }

  resizeCanvas() {
    const length = this.state.records.length;
    const width = this.getWidth(length);

    this.setState({
      width: width
    });
  }

  drawDiagram() {
    const height = 300;

    const max_good = this.state.points.max_good;
    const max_bad = this.state.points.max_bad;

    const max_points = Math.max(max_good, max_bad);

    let records = [...this.state.records];
    const length = records.length;

    const width = this.state.width;

    const max_records = Math.floor((width - 8) / 40);
    records = records.filter(record => record.index >= length - max_records); 

    const ctx = this.canvas.getContext('2d');

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.lineWidth = 16;
    
    records.forEach((record, i) => {
      const date = record.date;

      const good = record.points.good;
      const bad = record.points.bad;

      let angle = 90 * Math.PI / 180;

      ctx.fillStyle = '#000';

      ctx.rotate(angle);

      ctx.font = "bold 12px Arial";
      ctx.textAlign = 'left';
      ctx.fillText(date, height - 76, - 20 - i * 40);

      ctx.rotate(3 * angle);

      ctx.strokeStyle = '#ff0000';

      let x_bad = 40 * i + 16;
      let y_bad = height - 84;

      ctx.beginPath();
      ctx.moveTo(x_bad, y_bad);

      y_bad = y_bad - bad * (y_bad - 8) / max_points;
      ctx.lineTo(x_bad, y_bad);
      ctx.stroke();

      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.font = "bold 12px Arial";

      if (bad > 0) 
        ctx.fillText(bad, x_bad, y_bad + 12);

      ctx.strokeStyle = '#00008b';

      let x_good = x_bad + 16;
      let y_good = height - 84;

      ctx.beginPath();
      ctx.moveTo(x_good, y_good);

      y_good = (y_good - good * (y_good - 8) / max_points);
      
      ctx.lineTo(x_good, y_good);
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.font = "bold 12px Arial";

      if (good > 0)
        ctx.fillText(good, x_good, y_good + 12);
    });
  }

  render() {
    const index = this.getRecordIndex();
    const records = this.state.records;

    const points = index !== -1? records[index].points : {good: 0, bad: 0};

    return (
      <div>
        <div className='chart'>
          <canvas 
            ref={ref => this.canvas = ref}
            width={this.state.width} 
            height='300'>
          </canvas>
        </div>
        <h2 className='today'>Today</h2>
        <Incrementor points={points} incrementPoints={this.incrementPoints} />
        <button className='undo' onClick={this.undo}></button>
      </div>
    );
  }
}

export default Chart;