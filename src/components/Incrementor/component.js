import { Component } from 'react';
import './style.css';

class Incrementor extends Component {
  render() {
    return (
      <div className='incrementor'>
        <div className='bad'><strong>Bad</strong>:&nbsp;{this.props.points.bad}</div>
        <div className='buttons'>
          <button 
            className='button bad-button'
            onClick={(e) => {
              e.preventDefault();
              this.props.incrementPoints(2);
            }}>-
          </button>
          <button 
            className='button good-button'
            onClick={(e) => {
              e.preventDefault();
              this.props.incrementPoints(1)
            }}>+
          </button>
        </div>
        <div className='good'><strong>Good</strong>:&nbsp;{this.props.points.good}</div>
      </div>
    );
  }
}

export default Incrementor;